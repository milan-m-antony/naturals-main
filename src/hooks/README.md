# Hooks Directory

Custom React hooks for reusable state logic.

## Available Hooks

### `useAuth()`
Manages user authentication and profile.

**Returns:**
- `isUserAuthenticated` - Boolean for login state
- `userProfile` - User object or null
- `logout()` - Function to logout

### `useTheme()`
Dark mode toggle and persistence.

**Returns:**
- `isDarkMode` - Boolean for dark mode state
- `toggleTheme()` - Function to toggle theme

### `useNavigation()`
Application view switching.

**Returns:**
- `currentView` - Current page/view
- `navigateTo(view)` - Navigate to view
- `goHome()` - Go to homepage

### `useBooking()`
Multi-step booking wizard state management.

**Returns:**
- `bookingWizardStep` - Current step (0-4)
- `setStep(step)` - Update step
- `selectedServiceId` - Currently selected service
- `bookingData` - Booking form data
- `setBookingData(data)` - Update booking data
- `toggleService(id)` - Add/remove service
- `clearServices()` - Clear all services
- `resetBooking()` - Reset entire booking

**Features:**
- Clears service ID when navigating to dashboard
- Persists state to localStorage
- Restores state after login

### `useToggle(initialValue)`
Simple boolean toggle.

**Returns:**
- `[isOpen, toggle]` - State and toggle function

## Usage Examples

```javascript
// Authentication check
const { isUserAuthenticated } = useAuth();
if (!isUserAuthenticated) return <LoginPrompt />;

// Navigation
const { navigateTo } = useNavigation();
navigateTo('booking');

// Booking management
const { setStep, toggleService } = useBooking();
setStep(1);
toggleService(5);

// Theme toggle
const { isDarkMode, toggleTheme } = useTheme();
```

## Best Practices

- Call hooks at top level only
- Don't call hooks conditionally
- Use in React components, not regular functions
- Keep logic in hooks, JSX in components
