<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Service;
use App\Models\Staff;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BranchManagementController extends Controller
{
    /**
     * Get all active branches with stats
     */
    public function index(Request $request)
    {
        $query = Branch::active();

        if ($request->has('city')) {
            $query->inCity($request->get('city'));
        }

        if ($request->has('state')) {
            $query->inState($request->get('state'));
        }

        $branches = $query->with(['manager', 'staff'])
            ->get()
            ->map(function ($branch) {
                return [
                    'id' => $branch->id,
                    'name' => $branch->name,
                    'address' => $branch->full_address,
                    'phone' => $branch->phone,
                    'email' => $branch->email,
                    'manager' => $branch->manager?->only(['id', 'name', 'email']),
                    'location' => $branch->location,
                    'is_open_now' => $branch->isOpenNow(),
                    'total_revenue' => $branch->total_revenue,
                    'total_appointments' => $branch->total_appointments,
                    'active_staff_count' => $branch->active_staff_count,
                ];
            });

        return response()->json(['branches' => $branches]);
    }

    /**
     * Get single branch details
     */
    public function show($branchId)
    {
        $branch = Branch::with([
            'manager',
            'staff' => function ($query) {
                $query->where('is_active', true);
            },
            'businessHours',
            'holidays',
        ])->findOrFail($branchId);

        return response()->json([
            'branch' => [
                'id' => $branch->id,
                'name' => $branch->name,
                'full_address' => $branch->full_address,
                'address' => $branch->address,
                'city' => $branch->city,
                'state' => $branch->state,
                'postal_code' => $branch->postal_code,
                'phone' => $branch->phone,
                'email' => $branch->email,
                'location' => $branch->location,
                'manager' => $branch->manager,
                'opening_time' => $branch->opening_time,
                'closing_time' => $branch->closing_time,
                'is_open_now' => $branch->isOpenNow(),
                'description' => $branch->description,
                'is_active' => $branch->is_active,
                'staff' => $branch->staff->map(fn($s) => [
                    'id' => $s->id,
                    'name' => $s->user->name,
                    'specialization' => $s->specialization,
                    'rating' => $s->rating,
                ]),
                'business_hours' => $branch->businessHours,
                'holidays' => $branch->holidays,
                'total_revenue' => $branch->total_revenue,
                'total_appointments' => $branch->total_appointments,
                'active_staff_count' => $branch->active_staff_count,
            ],
        ]);
    }

    /**
     * Create new branch
     */
    public function store(Request $request)
    {
        $this->authorize('create', Branch::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'phone' => 'required|string|max:20',
            'email' => 'required|email',
            'manager_id' => 'nullable|exists:users,id',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'opening_time' => 'nullable|date_format:H:i',
            'closing_time' => 'nullable|date_format:H:i',
            'description' => 'nullable|string',
        ]);

        $branch = Branch::create([...$validated, 'is_active' => true]);

        return response()->json(['message' => 'Branch created successfully', 'data' => $branch], 201);
    }

    /**
     * Update branch
     */
    public function update(Request $request, $branchId)
    {
        $branch = Branch::findOrFail($branchId);
        $this->authorize('update', $branch);

        $validated = $request->validate([
            'name' => 'string|max:255',
            'address' => 'string',
            'city' => 'string|max:100',
            'state' => 'string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'phone' => 'string|max:20',
            'email' => 'email',
            'manager_id' => 'nullable|exists:users,id',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'opening_time' => 'nullable|date_format:H:i',
            'closing_time' => 'nullable|date_format:H:i',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $branch->update($validated);

        return response()->json(['message' => 'Branch updated successfully', 'data' => $branch]);
    }

    /**
     * Assign service to branch
     */
    public function assignService(Request $request, $branchId)
    {
        $this->authorize('update', Branch::findOrFail($branchId));

        $validated = $request->validate([
            'service_id' => 'required|exists:services,id',
            'is_available' => 'boolean',
        ]);

        $branch = Branch::findOrFail($branchId);

        $branch->services()->syncWithoutDetaching([
            $validated['service_id'] => ['is_available' => $validated['is_available'] ?? true],
        ]);

        return response()->json(['message' => 'Service assigned to branch successfully']);
    }

    /**
     * Remove service from branch
     */
    public function removeService($branchId, $serviceId)
    {
        $branch = Branch::findOrFail($branchId);
        $this->authorize('update', $branch);

        $branch->services()->detach($serviceId);

        return response()->json(['message' => 'Service removed from branch successfully']);
    }

    /**
     * Get services available at branch
     */
    public function getServices($branchId)
    {
        $branch = Branch::findOrFail($branchId);

        $services = $branch->services()
            ->select('services.id', 'services.name', 'services.price', 'services.duration')
            ->where('branch_services.is_available', true)
            ->get();

        return response()->json(['services' => $services]);
    }

    /**
     * Assign staff to branch
     */
    public function assignStaff(Request $request, $branchId)
    {
        $this->authorize('update', Branch::findOrFail($branchId));

        $validated = $request->validate([
            'staff_id' => 'required|exists:staff,id',
            'is_primary' => 'boolean',
        ]);

        $branch = Branch::findOrFail($branchId);
        $staff = Staff::findOrFail($validated['staff_id']);

        // If marking as primary, unmark other primary for this staff
        if ($validated['is_primary'] ?? false) {
            $staff->branches()->update(['is_primary' => false]);
        }

        $staff->branches()->syncWithoutDetaching([
            $branchId => ['is_primary' => $validated['is_primary'] ?? false],
        ]);

        return response()->json(['message' => 'Staff assigned to branch successfully']);
    }

    /**
     * Remove staff from branch
     */
    public function removeStaff($branchId, $staffId)
    {
        $branch = Branch::findOrFail($branchId);
        $this->authorize('update', $branch);

        $staff = Staff::findOrFail($staffId);
        $staff->branches()->detach($branchId);

        return response()->json(['message' => 'Staff removed from branch successfully']);
    }

    /**
     * Get staff working at branch
     */
    public function getStaff($branchId)
    {
        $branch = Branch::findOrFail($branchId);

        $staff = $branch->staff()
            ->with('user')
            ->where('is_active', true)
            ->get()
            ->map(function ($s) {
                return [
                    'id' => $s->id,
                    'name' => $s->user->name,
                    'email' => $s->user->email,
                    'phone' => $s->user->phone,
                    'specialization' => $s->specialization,
                    'rating' => $s->rating,
                    'is_available' => $s->is_available,
                ];
            });

        return response()->json(['staff' => $staff]);
    }

    /**
     * Get branch inventory
     */
    public function getInventory($branchId)
    {
        $branch = Branch::findOrFail($branchId);

        $inventory = $branch->inventory()
            ->select('id', 'name', 'quantity', 'unit_price', 'last_updated')
            ->get();

        return response()->json(['inventory' => $inventory]);
    }

    /**
     * Get branch appointments
     */
    public function getAppointments($branchId, Request $request)
    {
        $branch = Branch::findOrFail($branchId);

        $query = $branch->appointments();

        if ($request->has('status')) {
            $query->where('status', $request->get('status'));
        }

        if ($request->has('start_date')) {
            $query->whereDate('appointment_date', '>=', $request->get('start_date'));
        }

        if ($request->has('end_date')) {
            $query->whereDate('appointment_date', '<=', $request->get('end_date'));
        }

        $appointments = $query->with(['customer', 'staff'])
            ->orderBy('appointment_date')
            ->paginate($request->get('per_page', 20));

        return response()->json($appointments);
    }

    /**
     * Get branch statistics
     */
    public function getStatistics($branchId)
    {
        $branch = Branch::findOrFail($branchId);

        $stats = [
            'branch_id' => $branchId,
            'name' => $branch->name,
            'total_revenue' => $branch->total_revenue,
            'total_appointments' => $branch->total_appointments,
            'completed_appointments' => $branch->appointments()
                ->where('status', 'completed')
                ->count(),
            'cancelled_appointments' => $branch->appointments()
                ->where('status', 'cancelled')
                ->count(),
            'active_staff' => $branch->active_staff_count,
            'services_available' => $branch->services()->count(),
            'average_appointment_value' => $branch->appointments()
                ->where('status', 'completed')
                ->avg('total_amount') ?? 0,
            'customer_count' => $branch->appointments()
                ->select('user_id')
                ->distinct()
                ->count(),
        ];

        return response()->json($stats);
    }
}
