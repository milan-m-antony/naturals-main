<?php

namespace App\Http\Controllers;

use App\Models\Staff;
use App\Models\LeaveRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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
}
