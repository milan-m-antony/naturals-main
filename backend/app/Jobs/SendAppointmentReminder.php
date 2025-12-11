<?php

namespace App\Jobs;

use App\Mail\AppointmentReminder as AppointmentReminderMail;
use App\Models\AppointmentReminder;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendAppointmentReminder implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public AppointmentReminder $reminder)
    {
    }

    public function handle(): void
    {
        try {
            $appointment = $this->reminder->appointment;
            
            if ($this->reminder->reminder_type === 'email') {
                Mail::to($appointment->user->email)
                    ->send(new AppointmentReminderMail($appointment));
            }
            // Add SMS/WhatsApp handlers here if needed

            $this->reminder->update([
                'status' => 'sent',
                'sent_at' => now(),
            ]);
        } catch (\Exception $e) {
            $this->reminder->update([
                'status' => 'failed',
                'response' => $e->getMessage(),
            ]);
            \Log::error('Failed to send reminder: ' . $e->getMessage());
        }
    }
}
