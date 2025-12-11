<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Razorpay\Api\Api;

class PaymentController extends Controller
{
    protected $api;

    public function __construct()
    {
        // Lazy init to avoid breaking route:list when package/env not present
        if (class_exists(Api::class) && config('razorpay.key_id') && config('razorpay.key_secret')) {
            $this->api = new Api(
                config('razorpay.key_id'),
                config('razorpay.key_secret')
            );
        }
    }

    /**
     * Ensure Razorpay SDK is available and configured
     */
    protected function ensureApiConfigured()
    {
        if ($this->api) {
            return null;
        }

        return response()->json([
            'message' => 'Payment gateway not configured. Install razorpay/razorpay and set RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET.',
        ], 500);
    }

    // Create order
    public function createOrder(Request $request)
    {
        if ($response = $this->ensureApiConfigured()) {
            return $response;
        }

        $validator = Validator::make($request->all(), [
            'appointment_id' => 'required|exists:appointments,id',
            'amount' => 'required|numeric|min:1',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $appointment = Appointment::find($request->appointment_id);

        if ($appointment->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            // Create Razorpay order
            $order = $this->api->order->create([
                'amount' => (int)($request->amount * 100), // Convert to paise
                'currency' => 'INR',
                'receipt' => 'apt_' . $appointment->id,
                'notes' => [
                    'appointment_id' => $appointment->id,
                    'customer_name' => $appointment->user->name,
                ],
            ]);

            // Store payment record
            $payment = Payment::create([
                'appointment_id' => $appointment->id,
                'user_id' => auth()->id(),
                'razorpay_order_id' => $order['id'],
                'amount' => $request->amount,
                'currency' => 'INR',
                'status' => 'pending',
                'description' => $request->description,
            ]);

            return response()->json([
                'order_id' => $order['id'],
                'amount' => $request->amount,
                'currency' => 'INR',
                'key_id' => config('razorpay.key_id'),
                'payment_id' => $payment->id,
            ]);
        } catch (\Exception $e) {
            \Log::error('Razorpay order creation failed: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to create order'], 500);
        }
    }

    // Verify payment
    public function verify(Request $request)
    {
        if ($response = $this->ensureApiConfigured()) {
            return $response;
        }

        $validator = Validator::make($request->all(), [
            'razorpay_order_id' => 'required',
            'razorpay_payment_id' => 'required',
            'razorpay_signature' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // Verify signature
            $this->api->utility->verifyPaymentSignature([
                'order_id' => $request->razorpay_order_id,
                'payment_id' => $request->razorpay_payment_id,
                'signature' => $request->razorpay_signature,
            ]);

            // Find payment
            $payment = Payment::where('razorpay_order_id', $request->razorpay_order_id)->first();

            if (!$payment) {
                return response()->json(['message' => 'Payment not found'], 404);
            }

            // Update payment
            $payment->update([
                'razorpay_payment_id' => $request->razorpay_payment_id,
                'razorpay_signature' => $request->razorpay_signature,
                'status' => 'completed',
            ]);

            // Update appointment payment status
            $payment->appointment->update([
                'payment_status' => 'Paid',
            ]);

            return response()->json([
                'message' => 'Payment verified successfully',
                'payment' => $payment,
            ]);
        } catch (\Exception $e) {
            \Log::error('Payment verification failed: ' . $e->getMessage());
            return response()->json(['message' => 'Payment verification failed'], 400);
        }
    }

    // Get payment status
    public function getStatus($appointmentId)
    {
        $appointment = Appointment::find($appointmentId);

        if (!$appointment || $appointment->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $payment = Payment::where('appointment_id', $appointmentId)
            ->latest()
            ->first();

        if (!$payment) {
            return response()->json(['message' => 'No payment found'], 404);
        }

        return response()->json($payment);
    }

    // Refund payment
    public function refund(Request $request, $paymentId)
    {
        if ($response = $this->ensureApiConfigured()) {
            return $response;
        }

        $validator = Validator::make($request->all(), [
            'amount' => 'nullable|numeric|min:1',
            'reason' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $payment = Payment::find($paymentId);

        if (!$payment) {
            return response()->json(['message' => 'Payment not found'], 404);
        }

        try {
            $refundData = [
                'receipt' => 'ref_' . $payment->id,
            ];

            if ($request->has('amount')) {
                $refundData['amount'] = (int)($request->amount * 100);
            }

            if ($request->has('reason')) {
                $refundData['notes'] = ['reason' => $request->reason];
            }

            $refund = $this->api->payment($payment->razorpay_payment_id)->refund($refundData);

            $payment->update([
                'status' => 'refunded',
                'metadata' => array_merge(
                    $payment->metadata ?? [],
                    ['refund_id' => $refund['id']]
                ),
            ]);

            return response()->json([
                'message' => 'Refund initiated',
                'refund_id' => $refund['id'],
            ]);
        } catch (\Exception $e) {
            \Log::error('Refund failed: ' . $e->getMessage());
            return response()->json(['message' => 'Refund failed'], 500);
        }
    }
}
