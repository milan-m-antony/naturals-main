<?php

namespace App\Mail;

use App\Models\AppointmentReschedule;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Envelope;
use Illuminate\Queue\SerializesModels;

class AppointmentRescheduled extends Mailable
{
    use Queueable, SerializesModels;

    public $status; // 'pending', 'approved', 'rejected'

    public function __construct(public AppointmentReschedule $reschedule, $status = 'pending')
    {
        $this->status = $status;
    }

    public function envelope(): Envelope
    {
        $subject = match($this->status) {
            'approved' => 'Appointment Rescheduled - Confirmed',
            'rejected' => 'Reschedule Request - Not Approved',
            default => 'Reschedule Request - Pending Approval'
        };

        return new Envelope(
            subject: $subject . ' - NATURALS Salon',
        );
    }

    public function content(): \Illuminate\Mail\Content
    {
        return new \Illuminate\Mail\Content(
            view: 'emails.appointment_rescheduled',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
