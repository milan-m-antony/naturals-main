# Copilot Instructions (Strict)

## Frontend Development Guidelines

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

## Git & Version Control Rules

**CRITICAL:** Do NOT push to GitHub without explicit user approval.

### Workflow
1. Make code changes
2. Test locally
3. Run: `git add .`
4. Run: `git commit -m "Clear message"`
5. **STOP** - Wait for user approval before pushing

### Commit Message Format
- Feature: `Add [feature name] for [purpose]`
- Fix: `Fix [issue] in [component/file]`
- Docs: `Update [filename] with [changes]`
- Refactor: `Refactor [component] for [reason]`

Example: `Add mobile responsiveness to ServiceMenu` or `Fix type safety in BookingWizard`

### Staging Files
```bash
git add .              # Stage all changes
git status             # Verify staged files
git commit -m "msg"    # Create commit
# DO NOT PUSH until user says: "push to github" or "commit and push"
```

### Before Requesting Push
- Verify no console errors
- Check no TypeScript errors
- Confirm all changes tested locally
- Ensure descriptive commit message
- List files being committed

### Push Only When User Approves
```bash
git push origin main
```

### Common Commands
```bash
git status             # See current state
git diff               # See unstaged changes
git log --oneline -5   # See last 5 commits
git restore <file>     # Discard changes in file
git restore --staged   # Unstage files
```
