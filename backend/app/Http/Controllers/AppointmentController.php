<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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
}
