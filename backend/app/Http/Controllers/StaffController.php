<?php

namespace App\Http\Controllers;

use App\Models\Staff;
use App\Models\LeaveRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class StaffController extends Controller
{
    public function index(Request $request)
    {
        $query = Staff::with(['user', 'branch']);

        if ($request->has('branch_id')) {
            $query->where('branch_id', $request->branch_id);
        }

        if ($request->has('is_available')) {
            $query->where('is_available', $request->is_available);
        }

        $staff = $query->get();

        return response()->json($staff);
    }

    public function show($id)
    {
        $staff = Staff::with(['user', 'branch'])->find($id);

        if (!$staff) {
            return response()->json(['message' => 'Staff not found'], 404);
        }

        return response()->json($staff);
    }

    public function store(Request $request)
    {
        $user = auth()->user();

        // Only owner and admin (manager) can create staff
        if (!in_array($user->role, ['admin', 'owner'])) {
            return response()->json(['message' => 'Only owner and manager can create staff'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|min:6|max:20',
            'role' => 'nullable|string|max:100',
            'specialty' => 'nullable|string|max:255',
            'branch_id' => 'required|exists:branches,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Derive default password from first 6 digits of phone
        $sanitizedPhone = preg_replace('/\D/', '', $request->phone ?? '');
        $derivedPassword = strlen($sanitizedPhone) >= 6 ? substr($sanitizedPhone, 0, 6) : 'password123';

        // Log for debugging (remove in production)
        \Log::info('Creating staff user', [
            'email' => $request->email,
            'phone' => $request->phone,
            'sanitized_phone' => $sanitizedPhone,
            'derived_password' => $derivedPassword,
        ]);

        // Create user account for staff
        $staffUser = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => bcrypt($derivedPassword),
            'role' => 'staff',
        ]);

        // Create staff record
        $staff = Staff::create([
            'user_id' => $staffUser->id,
            'branch_id' => $request->branch_id,
            'specialty' => $request->specialty ?? $request->role,
            'rating' => 0,
            'is_available' => true,
        ]);

        $staff->load(['user', 'branch']);

        return response()->json([
            'message' => 'Staff created successfully',
            'staff' => $staff,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $staff = Staff::with('user')->find($id);

        if (!$staff) {
            return response()->json(['message' => 'Staff not found'], 404);
        }

        $user = auth()->user();

        if (!in_array($user->role, ['admin', 'owner'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $staff->user_id,
            'phone' => 'nullable|string|max:20',
            'role' => 'nullable|string|max:100',
            'specialty' => 'nullable|string|max:255',
            'is_available' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Update user info
        if ($staff->user) {
            $userUpdates = [];
            if ($request->has('name')) $userUpdates['name'] = $request->name;
            if ($request->has('email')) $userUpdates['email'] = $request->email;
            if ($request->has('phone')) $userUpdates['phone'] = $request->phone;
            
            if (!empty($userUpdates)) {
                $staff->user->update($userUpdates);
            }
        }

        // Update staff record
        $staffUpdates = [];
        if ($request->has('specialty')) $staffUpdates['specialty'] = $request->specialty;
        if ($request->has('role')) $staffUpdates['specialty'] = $request->role;
        if ($request->has('is_available')) $staffUpdates['is_available'] = $request->is_available;

        if (!empty($staffUpdates)) {
            $staff->update($staffUpdates);
        }

        $staff->load(['user', 'branch']);

        return response()->json([
            'message' => 'Staff updated successfully',
            'staff' => $staff,
        ]);
    }

    public function leaveRequests(Request $request)
    {
        $user = auth()->user();
        
        $query = LeaveRequest::with(['staff.user', 'approver']);

        // Staff can only see their own requests
        if ($user->role === 'staff') {
            $query->where('staff_id', $user->staff->id);
        }
        // Admin/Owner can see all or filter by status
        elseif ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('start_date')) {
            $query->whereDate('start_date', '>=', $request->start_date);
        }

        $leaveRequests = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($leaveRequests);
    }

    public function submitLeaveRequest(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = auth()->user();
        
        if (!$user->staff) {
            return response()->json(['message' => 'User is not a staff member'], 403);
        }

        // Check for overlapping leave requests
        $overlapping = LeaveRequest::where('staff_id', $user->staff->id)
            ->where('status', '!=', 'rejected')
            ->where(function ($query) use ($request) {
                $query->whereBetween('start_date', [$request->start_date, $request->end_date])
                      ->orWhereBetween('end_date', [$request->start_date, $request->end_date])
                      ->orWhere(function ($q) use ($request) {
                          $q->where('start_date', '<=', $request->start_date)
                            ->where('end_date', '>=', $request->end_date);
                      });
            })
            ->exists();

        if ($overlapping) {
            return response()->json([
                'message' => 'You already have a leave request for these dates'
            ], 409);
        }

        $leaveRequest = LeaveRequest::create([
            'staff_id' => $user->staff->id,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'reason' => $request->reason,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Leave request submitted successfully',
            'leave_request' => $leaveRequest,
        ], 201);
    }

    public function updateLeaveRequest(Request $request, $id)
    {
        $leaveRequest = LeaveRequest::find($id);

        if (!$leaveRequest) {
            return response()->json(['message' => 'Leave request not found'], 404);
        }

        $user = auth()->user();

        // Check if user can approve (owner/admin only)
        if (!in_array($user->role, ['admin', 'owner'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:approved,rejected',
            'rejection_reason' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->status === 'approved') {
            $leaveRequest->approve(auth()->id());
        } else {
            $leaveRequest->reject(auth()->id(), $request->input('rejection_reason'));
        }

        return response()->json([
            'message' => "Leave request {$request->status}",
            'leave_request' => $leaveRequest,
        ]);
    }

    /**
     * Upload and attach a profile image for a staff member.
     */
    public function uploadAvatar(Request $request, $id)
    {
        $staff = Staff::with('user')->find($id);

        if (!$staff) {
            return response()->json(['message' => 'Staff not found'], 404);
        }

        $user = auth()->user();

        // Only admin/owner or the staff user themselves can update
        if (!in_array($user->role, ['admin', 'owner']) && $staff->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'avatar' => 'required|image|max:2048', // ~2MB
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $path = $request->file('avatar')->store('avatars', 'public');
        $url = Storage::disk('public')->url($path);

        $staff->avatar = $url;
        $staff->save();

        if ($staff->user) {
            $staff->user->profile_image = $url;
            $staff->user->save();
        }

        return response()->json([
            'message' => 'Profile image updated',
            'avatar_url' => $url,
        ]);
    }

    public function destroy($id)
    {
        $staff = Staff::with('user')->find($id);

        if (!$staff) {
            return response()->json(['message' => 'Staff not found'], 404);
        }

        $user = auth()->user();

        if (!in_array($user->role, ['admin', 'owner'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Force delete the user (permanent delete from database)
        $userId = $staff->user_id;
        $staff->delete(); // Delete staff record first
        
        if ($userId) {
            User::where('id', $userId)->forceDelete(); // Force delete to remove from DB
        }

        return response()->json([
            'message' => 'Staff deleted successfully',
        ]);
    }

    public function toggleAvailability($id)
    {
        $staff = Staff::find($id);

        if (!$staff) {
            return response()->json(['message' => 'Staff not found'], 404);
        }

        $user = auth()->user();

        if (!in_array($user->role, ['admin', 'owner'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $staff->is_available = !$staff->is_available;
        $staff->save();

        return response()->json([
            'message' => 'Staff availability updated',
            'staff' => $staff,
        ]);
    }
}
