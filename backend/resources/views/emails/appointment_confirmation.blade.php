@component('mail::message')
# Appointment Confirmation

Dear {{ $appointment->user->name }},

Your appointment has been successfully confirmed! Here are the details:

@component('mail::panel')
**Service:** {{ $appointment->service->name }}
**Date:** {{ \Carbon\Carbon::parse($appointment->appointment_date)->format('l, F j, Y') }}
**Time:** {{ $appointment->appointment_time }}
**Duration:** {{ $appointment->service->duration }} minutes
**Price:** ₹{{ $appointment->service->price }}
@endcomponent

## Next Steps
1. Arrive 5-10 minutes early
2. Bring any relevant documents/ID
3. For any changes, reschedule from your dashboard or call us

**Questions?** Reply to this email or contact us at support@naturalssalon.com

Thanks,
NATURALS Salon Team
@endcomponent
