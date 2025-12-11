@component('mail::message')
# Reschedule Request Update

Dear {{ $reschedule->appointment->user->name }},

Your appointment reschedule request has been {{ strtolower($status) }}.

@component('mail::panel')
**Original Date:** {{ \Carbon\Carbon::parse($reschedule->original_date)->format('l, F j, Y') }}
**Original Time:** {{ $reschedule->original_time }}

**Requested Date:** {{ \Carbon\Carbon::parse($reschedule->new_date)->format('l, F j, Y') }}
**Requested Time:** {{ $reschedule->new_time }}

**Status:** <span style="color: {{ $status === 'approved' ? 'green' : 'red' }}; font-weight: bold;">{{ ucfirst($status) }}</span>

@if($status === 'rejected' && $reschedule->admin_notes)
**Reason:** {{ $reschedule->admin_notes }}
@elseif($status === 'approved')
Your new appointment is confirmed for {{ \Carbon\Carbon::parse($reschedule->new_date)->format('l, F j, Y') }} at {{ $reschedule->new_time }}.
@endif
@endcomponent

@if($status !== 'approved')
Please visit your dashboard to request a new time or contact support for assistance.
@endif

Thanks,
NATURALS Salon Team
@endcomponent
