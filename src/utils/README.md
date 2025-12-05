# Utils Directory

Helper functions and utilities.

## Available Functions

### helpers.ts

**debounce(fn, delay)**
- Delays function execution until after specified ms of inactivity
- Usage: Search input, resize handlers

**throttle(fn, delay)** 
- Limits function execution frequency
- Usage: Scroll events, frequent updates

**formatPrice(amount)**
- Formats number as currency: ₹1,299.99

**formatDate(date)**
- Formats date string: "25 Dec 2025"

### service.utils.ts

**getServicePrice(service)**
- Calculates price after discount

**filterServices(services, filters)**
- Filters by category, price, availability

**groupServicesByCategory(services)**
- Groups services by category

## Common Patterns

### Array Operations
```javascript
// Filter and map
const names = services.filter(s => s.available).map(s => s.name);

// Find single item
const service = services.find(s => s.id === 5);

// Sum values
const total = services.reduce((sum, s) => sum + s.price, 0);

// Sort
const sorted = services.sort((a, b) => a.price - b.price);
```

### String Operations
```javascript
// Trim and lowercase
const normalized = input.trim().toLowerCase();

// Template strings
const message = `Service: ${service.name} - ₹${service.price}`;

// Check contains
if (text.includes('discount')) { /* ... */ }
```

### Date Operations
```javascript
// Current date
const today = new Date();

// ISO format
const isoDate = date.toISOString().split('T')[0];

// Future date
const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
```

### localStorage
```javascript
// Save
localStorage.setItem('key', JSON.stringify(value));

// Load
const saved = localStorage.getItem('key');
const value = saved ? JSON.parse(saved) : defaultValue;
```

## Validation

```javascript
// Email
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Phone (10 digits)
const isValidPhone = (phone) => /^[0-9]{10}$/.test(phone.replace(/\D/g, ''));

// Required fields
const validateForm = (data) => {
  const errors = [];
  if (!data.name) errors.push('Name required');
  if (!isValidEmail(data.email)) errors.push('Invalid email');
  return errors;
};
```

## Error Handling

```javascript
try {
  // Operation
} catch (error) {
  const message = error.response?.data?.message || 'Error occurred';
  console.error(message);
}
```

## Number Utilities

```javascript
// Format currency
const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN')}`;

// Calculate discount
const discount = amount * (1 - discountPercent / 100);

// Calculate tax
const tax = amount * (18 / 100);
```

## DOM Utilities

```javascript
// Scroll to element
const scrollToElement = (elementId) => {
  document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth' });
};

// Copy to clipboard
const copyToClipboard = (text) => navigator.clipboard.writeText(text);
```

## Best Practices

- Keep functions pure (no side effects)
- Single responsibility (one purpose)
- Add default parameters
- Return sensible defaults on error
- Document complex logic with comments
