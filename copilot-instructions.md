# Copilot Instructions (Strict)

- Follow existing UI/UX patterns; do not introduce new design systems.
- Create/modify components to match current styling and structure.
- Keep answers short and clear; avoid bulky explanations.
- Use React + TypeScript + Tailwind v3.4; reuse hooks and context.
- State: Use `DataContext` and custom hooks (`useAuth`, `useData`, `useBooking`).
- Auth: Respect JWT token in `localStorage`; use `userProfile` from `useAuth`.
- API: Use services under `src/services/api/*` (`appointmentService`, `inventoryService`, etc.).
- Booking: After confirmation, refresh appointments and redirect to dashboard.
- Admin: Use `updateAppointment` for reschedule/staff reassignment; call refresh after updates; show lightweight toasts.
- Do not add external libraries; prioritize small, focused changes.
- Document only key points in `README.md`; keep concise updates.
