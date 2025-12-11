<?php

namespace App\Http\Controllers;

use App\Models\MembershipPlan;
use App\Models\UserMembership;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class MembershipController extends Controller
{
    // Get all active plans
    public function getPlans()
    {
        $plans = MembershipPlan::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json($plans);
    }

    // Get single plan
    public function getPlan($id)
    {
        $plan = MembershipPlan::find($id);

        if (!$plan) {
            return response()->json(['message' => 'Plan not found'], 404);
        }

        return response()->json($plan);
    }

    // Get user's current membership
    public function getUserMembership()
    {
        $membership = UserMembership::where('user_id', auth()->id())
            ->where('status', 'active')
            ->where('expires_at', '>=', Carbon::today())
            ->with('plan')
            ->first();

        if (!$membership) {
            return response()->json(null);
        }

        return response()->json([
            'membership' => $membership,
            'isActive' => $membership->isActive(),
            'daysRemaining' => $membership->days_remaining,
        ]);
    }

    // Subscribe to plan
    public function subscribe(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'plan_id' => 'required|exists:membership_plans,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $plan = MembershipPlan::find($request->plan_id);

        // Check if user already has active membership
        $existingMembership = UserMembership::where('user_id', auth()->id())
            ->where('status', 'active')
            ->where('expires_at', '>=', Carbon::today())
            ->first();

        if ($existingMembership) {
            return response()->json([
                'message' => 'You already have an active membership',
                'membership' => $existingMembership,
            ], 409);
        }

        $startDate = Carbon::today();
        $expiryDate = $startDate->copy()->addDays($plan->duration_days);

        $membership = UserMembership::create([
            'user_id' => auth()->id(),
            'membership_plan_id' => $plan->id,
            'started_at' => $startDate,
            'expires_at' => $expiryDate,
            'status' => 'active',
            'free_services_remaining' => $plan->free_services,
        ]);

        return response()->json([
            'message' => 'Membership activated successfully',
            'membership' => $membership->load('plan'),
        ], 201);
    }

    // Cancel membership
    public function cancel(Request $request)
    {
        $membership = UserMembership::where('user_id', auth()->id())
            ->where('status', 'active')
            ->first();

        if (!$membership) {
            return response()->json(['message' => 'No active membership found'], 404);
        }

        $membership->cancel($request->input('reason'));

        return response()->json([
            'message' => 'Membership cancelled',
            'membership' => $membership,
        ]);
    }

    // Renew membership
    public function renew(Request $request)
    {
        $membership = UserMembership::where('user_id', auth()->id())
            ->where('status', 'active')
            ->first();

        if (!$membership) {
            return response()->json(['message' => 'No active membership found'], 404);
        }

        if ($membership->expires_at->isFuture()) {
            return response()->json([
                'message' => 'Your membership is still active. Renewal not yet available.',
            ], 400);
        }

        $membership->renew();

        return response()->json([
            'message' => 'Membership renewed successfully',
            'membership' => $membership->load('plan'),
        ]);
    }

    // Admin: Create plan
    public function storePlan(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration_days' => 'required|integer|min:1',
            'discount_percentage' => 'required|numeric|min:0|max:100',
            'free_services' => 'required|integer|min:0',
            'priority_booking' => 'boolean',
            'free_extensions' => 'boolean',
            'max_concurrent_bookings' => 'nullable|integer|min:1',
            'benefits' => 'nullable|json',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $plan = MembershipPlan::create($validator->validated());

        return response()->json([
            'message' => 'Plan created successfully',
            'plan' => $plan,
        ], 201);
    }

    // Admin: Update plan
    public function updatePlan(Request $request, MembershipPlan $plan)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'duration_days' => 'sometimes|integer|min:1',
            'discount_percentage' => 'sometimes|numeric|min:0|max:100',
            'free_services' => 'sometimes|integer|min:0',
            'priority_booking' => 'sometimes|boolean',
            'free_extensions' => 'sometimes|boolean',
            'max_concurrent_bookings' => 'nullable|integer|min:1',
            'benefits' => 'nullable|json',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $plan->update($validator->validated());

        return response()->json([
            'message' => 'Plan updated successfully',
            'plan' => $plan,
        ]);
    }

    // Admin: Delete plan
    public function destroyPlan(MembershipPlan $plan)
    {
        $plan->delete();

        return response()->json(['message' => 'Plan deleted successfully']);
    }

    // Admin: List all memberships
    public function listMemberships(Request $request)
    {
        $query = UserMembership::with(['user', 'plan']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('plan_id')) {
            $query->where('membership_plan_id', $request->plan_id);
        }

        $memberships = $query->paginate(15);

        return response()->json($memberships);
    }
}
