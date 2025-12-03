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
        
        $query = LeaveRequest::with('staff.user');

        if ($user->role === 'staff') {
            $query->where('staff_id', $user->staff->id);
        }

        $leaveRequests = $query->orderBy('created_at', 'desc')->get();

        return response()->json($leaveRequests);
    }

    public function submitLeaveRequest(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = auth()->user();
        
        if (!$user->staff) {
            return response()->json(['message' => 'User is not a staff member'], 403);
        }

        $leaveRequest = LeaveRequest::create([
            'staff_id' => $user->staff->id,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'reason' => $request->reason,
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

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:Pending,Approved,Rejected',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $leaveRequest->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Leave request updated successfully',
            'leave_request' => $leaveRequest,
        ]);
    }
}
