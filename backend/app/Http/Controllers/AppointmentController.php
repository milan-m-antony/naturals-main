<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Service;
use App\Models\ServiceReview;
use App\Models\AppointmentReschedule;
use App\Mail\AppointmentConfirmation;
use App\Mail\AppointmentReminder;
use App\Mail\AppointmentRescheduled;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        
        $query = Appointment::with(['services', 'staff.user', 'branch']);

        // Role-based filtering
        if ($user->role === 'customer') {
            $query->where('user_id', $user->id);
        } elseif ($user->role === 'staff') {
            $query->where('staff_id', $user->staff->id);
        }
        // Admin and owner can see all

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('date')) {
            $query->whereDate('date', $request->date);
        }

        $appointments = $query->orderBy('date', 'desc')->get();

        return response()->json($appointments);
    }

    public function show($id)
    {
        $appointment = Appointment::with(['services', 'staff.user', 'branch'])->find($id);

        if (!$appointment) {
            return response()->json(['message' => 'Appointment not found'], 404);
        }

        return response()->json($appointment);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'branch_id' => 'required|exists:branches,id',
            'staff_id' => 'required|exists:staff,id',
            'date' => 'required|date',
            'time' => 'required',
            'customer_name' => 'required|string',
            'services' => 'required|array',
            'services.*.id' => 'required|exists:services,id',
            'total_price' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $appointment = Appointment::create([
            'user_id' => auth()->id(),
            'branch_id' => $request->branch_id,
            'staff_id' => $request->staff_id,
            'date' => $request->date,
            'time' => $request->time,
            'customer_name' => $request->customer_name,
            'customer_phone' => $request->customer_phone,
            'customer_email' => $request->customer_email,
            'status' => 'Scheduled',
            'payment_method' => $request->payment_method ?? 'Pay at Venue',
            'total_price' => $request->total_price,
            'notes' => $request->notes,
        ]);

        // Attach services
        foreach ($request->services as $service) {
            $appointment->services()->attach($service['id'], [
                'price' => $service['price'] ?? 0,
            ]);
        }

        // Send confirmation email
        try {
            Mail::to($appointment->user->email)->send(new AppointmentConfirmation($appointment));
        } catch (\Exception $e) {
            \Log::error('Failed to send appointment confirmation email: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Appointment created successfully',
            'appointment' => $appointment->load('services'),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $appointment = Appointment::find($id);

        if (!$appointment) {
            return response()->json(['message' => 'Appointment not found'], 404);
        }

        $appointment->update($request->all());

        return response()->json([
            'message' => 'Appointment updated successfully',
            'appointment' => $appointment,
        ]);
    }

    public function destroy($id)
    {
        $appointment = Appointment::find($id);

        if (!$appointment) {
            return response()->json(['message' => 'Appointment not found'], 404);
        }

        $appointment->delete();

        return response()->json(['message' => 'Appointment deleted successfully']);
    }

    public function updateStatus(Request $request, $id)
    {
        $appointment = Appointment::find($id);

        if (!$appointment) {
            return response()->json(['message' => 'Appointment not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:Scheduled,Completed,Cancelled,Pending,In Progress',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $appointment->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Appointment status updated',
            'appointment' => $appointment,
        ]);
    }

    // Submit review for completed appointment
    public function submitReview(Request $request, Appointment $appointment)
    {
        if ($appointment->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($appointment->status !== 'Completed') {
            return response()->json(['message' => 'Can only review completed appointments'], 400);
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'nullable|string|max:1000'
        ]);

        $appointment->update([
            'rating' => $validated['rating'],
            'review' => $validated['review'] ?? null
        ]);

        return response()->json(['message' => 'Review submitted successfully', 'data' => $appointment]);
    }

    // Get reviews
    public function getReviews(Request $request)
    {
        $reviews = Appointment::whereNotNull('rating')
            ->where('status', 'Completed')
            ->with(['user'])
            ->latest('updated_at')
            ->paginate(10);

        return response()->json($reviews);
    }

    // Submit review for specific service
    public function submitServiceReview(Request $request, $serviceId)
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'nullable|string|max:1000',
            'appointment_id' => 'nullable|exists:appointments,id'
        ]);

        $service = Service::find($serviceId);
        if (!$service) {
            return response()->json(['message' => 'Service not found'], 404);
        }

        // Create or update review
        $serviceReview = ServiceReview::updateOrCreate(
            [
                'service_id' => $serviceId,
                'user_id' => auth()->id(),
                'appointment_id' => $validated['appointment_id'] ?? null,
            ],
            [
                'rating' => $validated['rating'],
                'review' => $validated['review'] ?? null,
            ]
        );

        // Recalculate service rating
        $avgRating = ServiceReview::where('service_id', $serviceId)
            ->avg('rating');
        $reviewCount = ServiceReview::where('service_id', $serviceId)->count();

        $service->update([
            'rating' => round($avgRating, 1),
            'reviews_count' => $reviewCount,
        ]);

        return response()->json([
            'message' => 'Review submitted successfully',
            'data' => $serviceReview,
            'service_rating' => [
                'rating' => $service->rating,
                'reviews_count' => $service->reviews_count,
            ]
        ]);
    }

    // Get reviews for a specific service
    public function getServiceReviews($serviceId)
    {
        $reviews = ServiceReview::where('service_id', $serviceId)
            ->with(['user'])
            ->latest('created_at')
            ->paginate(10);

        return response()->json($reviews);
    }

    // Request appointment reschedule
    public function requestReschedule(Request $request, Appointment $appointment)
    {
        if ($appointment->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (in_array($appointment->status, ['Completed', 'Cancelled'])) {
            return response()->json(['message' => 'Cannot reschedule completed or cancelled appointments'], 400);
        }

        $validated = $request->validate([
            'new_date' => 'required|date|after:now',
            'new_time' => 'required|date_format:H:i',
            'reason' => 'nullable|string|max:500'
        ]);

        $reschedule = AppointmentReschedule::create([
            'appointment_id' => $appointment->id,
            'original_date' => $appointment->date,
            'original_time' => $appointment->time,
            'new_date' => $validated['new_date'],
            'new_time' => $validated['new_time'],
            'reason' => $validated['reason'] ?? null,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Reschedule request submitted',
            'data' => $reschedule
        ]);
    }

    // Get reschedule requests for customer
    public function getRescheduleRequests(Request $request)
    {
        $user = auth()->user();

        $query = AppointmentReschedule::with(['appointment']);

        if ($user->role === 'customer') {
            $query->whereHas('appointment', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }

        $reschedules = $query->latest('created_at')->paginate(10);

        return response()->json($reschedules);
    }

    // Approve/Reject reschedule (staff/admin)
    public function approveReschedule(Request $request, $rescheduleId)
    {
        $user = auth()->user();
        if (!in_array($user->role, ['admin', 'owner', 'staff'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
            'admin_notes' => 'nullable|string|max:500'
        ]);

        $reschedule = AppointmentReschedule::find($rescheduleId);
        if (!$reschedule) {
            return response()->json(['message' => 'Reschedule request not found'], 404);
        }

        $reschedule->update([
            'status' => $validated['status'],
            'staff_id' => auth()->id(),
            'admin_notes' => $validated['admin_notes'] ?? null,
        ]);

        // If approved, update appointment
        if ($validated['status'] === 'approved') {
            $appointment = $reschedule->appointment;
            $appointment->update([
                'date' => $reschedule->new_date,
                'time' => $reschedule->new_time,
            ]);
        }

        // Send email notification
        try {
            Mail::to($reschedule->appointment->user->email)
                ->send(new AppointmentRescheduled($reschedule, $validated['status']));
        } catch (\Exception $e) {
            \Log::error('Failed to send reschedule email: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Reschedule request ' . $validated['status'],
            'data' => $reschedule
        ]);
    }

    // Get user's service reviews
    public function getUserReviews(Request $request)
    {
        $user = auth()->user();

        $reviews = ServiceReview::where('user_id', $user->id)
            ->with(['service'])
            ->latest('created_at')
            ->paginate(10);

        // Map to include service name
        $data = $reviews->map(function ($review) {
            return [
                'id' => $review->id,
                'service_id' => $review->service_id,
                'user_id' => $review->user_id,
                'service_name' => $review->service?->name,
                'rating' => $review->rating,
                'review' => $review->review,
                'created_at' => $review->created_at,
                'updated_at' => $review->updated_at,
            ];
        });

        return response()->json([
            'data' => $data,
            'current_page' => $reviews->currentPage(),
            'last_page' => $reviews->lastPage(),
            'total' => $reviews->total(),
        ]);
    }
}
