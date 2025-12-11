@component('mail::message')
# Appointment Reminder

Dear {{ $reschedule->appointment->user->name }},

This is a friendly reminder about your upcoming appointment!

@component('mail::panel')
**Service:** {{ $reschedule->appointment->service->name }}
**Date:** {{ \Carbon\Carbon::parse($reschedule->appointment->appointment_date)->format('l, F j, Y') }}
**Time:** {{ $reschedule->appointment->appointment_time }}
**Duration:** {{ $reschedule->appointment->service->duration }} minutes
@endcomponent

If you need to reschedule, please do so from your customer dashboard at least 24 hours before your appointment.

See you soon!

Thanks,
NATURALS Salon Team
@endcomponent
