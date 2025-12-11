<?php

namespace App\Http\Controllers;

use App\Models\CustomerNote;
use App\Models\CustomerPreference;
use App\Models\CustomerInteraction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CRMController extends Controller
{
    /**
     * Get customer CRM profile (notes, preferences, interaction history)
     */
    public function getCustomerProfile($userId)
    {
        $customer = User::findOrFail($userId);

        return response()->json([
            'customer' => [
                'id' => $customer->id,
                'name' => $customer->name,
                'email' => $customer->email,
                'phone' => $customer->phone,
                'lifetime_value' => $customer->appointments()->sum('total_amount') ?? 0,
                'total_appointments' => $customer->appointments()->count(),
                'average_rating' => CustomerInteraction::averageRating($userId),
                'created_at' => $customer->created_at,
                'last_appointment' => $customer->appointments()
                    ->where('status', 'completed')
                    ->orderBy('appointment_date', 'desc')
                    ->first(['id', 'appointment_date', 'total_amount']),
            ],
            'preferences' => CustomerPreference::where('user_id', $userId)->first(),
            'recent_notes' => CustomerNote::forCustomer($userId, 5),
            'recent_interactions' => CustomerInteraction::recentForCustomer($userId, 10),
        ]);
    }

    /**
     * Add or update customer preferences
     */
    public function updatePreferences(Request $request, $userId)
    {
        $this->authorize('update', User::findOrFail($userId));

        $validated = $request->validate([
            'preferred_staff_id' => 'nullable|exists:users,id',
            'preferred_time_slot' => 'nullable|in:morning,afternoon,evening',
            'communication_preference' => 'nullable|in:email,sms,whatsapp,both,all',
            'appointment_reminders' => 'boolean',
            'reminder_advance_days' => 'integer|min:1|max:30',
            'special_requirements' => 'nullable|array',
            'allergies' => 'nullable|array',
            'skin_type' => 'nullable|in:oily,dry,combination,sensitive,unknown',
            'preferred_services' => 'nullable|array',
            'do_not_contact' => 'boolean',
            'preferred_branch_id' => 'nullable|exists:branches,id',
        ]);

        $preferences = CustomerPreference::updateOrCreate(
            ['user_id' => $userId],
            $validated
        );

        return response()->json(['message' => 'Preferences updated successfully', 'data' => $preferences], 200);
    }

    /**
     * Add a note for a customer
     */
    public function addNote(Request $request, $userId)
    {
        $this->authorize('update', User::findOrFail($userId));

        $validated = $request->validate([
            'note' => 'required|string|min:10',
            'is_internal' => 'boolean',
            'importance' => 'integer|min:1|max:5',
        ]);

        $note = CustomerNote::create([
            'user_id' => $userId,
            'note' => $validated['note'],
            'created_by' => Auth::id(),
            'is_internal' => $validated['is_internal'] ?? false,
            'importance' => $validated['importance'] ?? 1,
        ]);

        return response()->json(['message' => 'Note added successfully', 'data' => $note], 201);
    }

    /**
     * Get customer notes
     */
    public function getNotes($userId, Request $request)
    {
        $query = CustomerNote::where('user_id', $userId);

        if ($request->has('important')) {
            $query->important();
        }

        if (!Auth::user()->hasRole('admin|owner')) {
            $query->public();
        }

        $notes = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($notes);
    }

    /**
     * Update a note
     */
    public function updateNote(Request $request, $userId, $noteId)
    {
        $note = CustomerNote::where('user_id', $userId)
            ->where('id', $noteId)
            ->firstOrFail();

        $this->authorize('update', $note);

        $validated = $request->validate([
            'note' => 'required|string|min:10',
            'is_internal' => 'boolean',
            'importance' => 'integer|min:1|max:5',
        ]);

        $note->update($validated);

        return response()->json(['message' => 'Note updated successfully', 'data' => $note]);
    }

    /**
     * Delete a note
     */
    public function deleteNote($userId, $noteId)
    {
        $note = CustomerNote::where('user_id', $userId)
            ->where('id', $noteId)
            ->firstOrFail();

        $this->authorize('delete', $note);
        $note->delete();

        return response()->json(['message' => 'Note deleted successfully'], 200);
    }

    /**
     * Log a customer interaction
     */
    public function logInteraction(Request $request, $userId)
    {
        $this->authorize('update', User::findOrFail($userId));

        $validated = $request->validate([
            'interaction_type' => 'required|in:call,inquiry,complaint,feedback,cancellation,reschedule',
            'description' => 'required|string|min:10',
            'appointment_id' => 'nullable|exists:appointments,id',
            'service_id' => 'nullable|exists:services,id',
            'rating' => 'nullable|integer|min:1|max:5',
            'feedback' => 'nullable|string',
            'staff_id' => 'nullable|exists:users,id',
            'channel' => 'required|in:phone,email,sms,whatsapp,in-person,web',
        ]);

        $interaction = CustomerInteraction::create([
            'user_id' => $userId,
            ...$validated,
        ]);

        return response()->json(['message' => 'Interaction logged successfully', 'data' => $interaction], 201);
    }

    /**
     * Get customer interaction history
     */
    public function getInteractions($userId, Request $request)
    {
        $query = CustomerInteraction::where('user_id', $userId);

        if ($request->has('type')) {
            $query->byType($request->get('type'));
        }

        if ($request->has('channel')) {
            $query->fromChannel($request->get('channel'));
        }

        if ($request->get('rated_only', false)) {
            $query->rated();
        }

        $interactions = $query->orderBy('interaction_date', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($interactions);
    }

    /**
     * Get customer lifecycle data (for analytics)
     */
    public function getCustomerLifecycle($userId)
    {
        $customer = User::findOrFail($userId);

        $appointmentStats = DB::table('appointments')
            ->where('user_id', $userId)
            ->selectRaw(
                'COUNT(*) as total_appointments, 
                SUM(total_amount) as lifetime_value,
                AVG(CASE WHEN status = "completed" THEN 1 ELSE 0 END) as completion_rate,
                MIN(appointment_date) as first_appointment_date'
            )
            ->first();

        $averageRating = CustomerInteraction::averageRating($userId);

        $interactionSummary = DB::table('customer_interactions')
            ->where('user_id', $userId)
            ->selectRaw('interaction_type, COUNT(*) as count')
            ->groupBy('interaction_type')
            ->get()
            ->pluck('count', 'interaction_type');

        return response()->json([
            'customer_id' => $userId,
            'lifetime_value' => $appointmentStats->lifetime_value ?? 0,
            'total_appointments' => $appointmentStats->total_appointments ?? 0,
            'completion_rate' => ($appointmentStats->completion_rate ?? 0) * 100,
            'average_rating' => $averageRating,
            'first_appointment_date' => $appointmentStats->first_appointment_date,
            'interaction_summary' => $interactionSummary,
            'member_since' => $customer->created_at,
            'days_as_customer' => $customer->created_at->diffInDays(now()),
        ]);
    }

    /**
     * Search customers by name, email, or phone
     */
    public function searchCustomers(Request $request)
    {
        $this->authorize('viewAny', CustomerPreference::class);

        $search = $request->get('search', '');

        $customers = User::where(function ($query) use ($search) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('phone', 'like', "%{$search}%");
        })
            ->whereHas('roles', function ($q) {
                $q->where('name', 'customer');
            })
            ->with('preferences')
            ->limit(20)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'lifetime_value' => $user->appointments()->sum('total_amount') ?? 0,
                    'preferences' => $user->preferences,
                ];
            });

        return response()->json(['results' => $customers]);
    }

    /**
     * Get customers by communication preference for marketing campaigns
     */
    public function getCustomersByPreference(Request $request)
    {
        $this->authorize('viewAny', CustomerPreference::class);

        $validated = $request->validate([
            'communication_preference' => 'nullable|in:email,sms,whatsapp,both,all',
            'min_lifetime_value' => 'nullable|numeric|min:0',
            'has_preferred_staff' => 'nullable|boolean',
            'limit' => 'integer|min:1|max:1000',
        ]);

        $query = CustomerPreference::query();

        if ($request->has('communication_preference')) {
            $pref = $validated['communication_preference'];
            $query->where(function ($q) use ($pref) {
                if ($pref === 'email') {
                    $q->where('communication_preference', 'email')
                        ->orWhere('communication_preference', 'both')
                        ->orWhere('communication_preference', 'all');
                } else if ($pref === 'sms') {
                    $q->where('communication_preference', 'sms')
                        ->orWhere('communication_preference', 'both')
                        ->orWhere('communication_preference', 'all');
                }
            });
        }

        if ($request->has('min_lifetime_value')) {
            $query->whereHas('customer', function ($q) use ($validated) {
                $q->whereRaw(
                    '(SELECT SUM(total_amount) FROM appointments WHERE user_id = users.id) >= ?',
                    [$validated['min_lifetime_value']]
                );
            });
        }

        if ($request->get('has_preferred_staff')) {
            $query->whereNotNull('preferred_staff_id');
        }

        $customers = $query->with('customer')
            ->limit($validated['limit'] ?? 100)
            ->get()
            ->map(function ($pref) {
                return [
                    'id' => $pref->user_id,
                    'name' => $pref->customer->name,
                    'email' => $pref->customer->email,
                    'phone' => $pref->customer->phone,
                    'communication_preference' => $pref->communication_preference,
                ];
            });

        return response()->json(['total' => count($customers), 'results' => $customers]);
    }
}
