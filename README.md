# rfhook

A lightweight React hook for handling form submissions with advanced form data parsing capabilities. Supports nested objects, arrays, and dot notation for complex form structures.

## Features

- :rocket: **Simple API** - Just one hook to handle all your form needs
- :dart: **TypeScript Support** - Fully typed with generic support
- :wrench: **Nested Objects** - Parse nested form data with dot notation (`user.name`)
- :clipboard: **Array Support** - Handle arrays with indexed notation (`items[0]`)
- :floppy_disk: **Automatic Prevention** - Prevents default form submission behavior by default
- :seedling: **Form Initialization** - Pre-populate forms with initial data or load data dynamically
- :arrows_counterclockwise: **Smart Reset** - Reset to initial state, custom data, or clear completely
- :money_with_wings: **Lightweight** - Zero dependencies (except React)
- :memo: **Framework Agnostic** - Works with any form structure

## Installation

```bash
npm install rfhook
```

```bash
pnpm add rfhook
```

```bash
yarn add rfhook
```

## Quick Start

### Basic Usage

```tsx
import React from 'react';
import { useForm } from 'rfhook';

interface FormData {
  email: string;
  password: string;
}

function LoginForm() {
  const { ref, onSubmit } = useForm<FormData>({
    submit: (data) => {
      console.log(data); // { email: "user@example.com", password: "secret" }
    }
  });

  return (
    <form ref={ref} onSubmit={onSubmit}>
      <input name="email" type="email" />
      <input name="password" type="password" />
      <button type="submit">Login</button>
    </form>
  );
}
```

### With Initial Data

```tsx
import React, { useEffect } from 'react';
import { useForm } from 'rfhook';

function EditUserForm({ userId }) {
  const form = useForm<FormData>({
    submit: (data) => updateUser(userId, data),
    initialData: { name: '', email: '', phone: '' }
  });

  // Load user data and initialize form
  useEffect(() => {
    const loadUser = async () => {
      if (userId) {
        const userData = await fetchUser(userId);
        form.initialize(userData);
      } else {
        form.initialize(); // Use initialData
      }
    };

    loadUser();
  }, [userId]);

  return (
    <form ref={form.ref} onSubmit={form.onSubmit}>
      <input name="name" placeholder="Name" />
      <input name="email" type="email" placeholder="Email" />
      <input name="phone" placeholder="Phone" />
      <button type="submit">Save</button>
    </form>
  );
}
```

## Advanced Usage

### Nested Objects

Use dot notation to create nested objects:

```tsx
interface UserForm {
  user: {
    profile: {
      name: string;
      age: number;
    };
    preferences: {
      theme: string;
    };
  };
}

function UserForm() {
  const { ref, onSubmit } = useForm<UserForm>({
    submit: (data) => {
      console.log(data);
      // {
      //   user: {
      //     profile: {
      //       name: "John Doe",
      //       age: "30"
      //     },
      //     preferences: {
      //       theme: "dark"
      //     }
      //   }
      // }
    }
  });

  return (
    <form ref={ref} onSubmit={onSubmit}>
      <input name="user.profile.name" placeholder="Name" />
      <input name="user.profile.age" type="number" placeholder="Age" />
      <select name="user.preferences.theme">
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Arrays

Use bracket notation to handle arrays:

```tsx
interface TodoForm {
  todos: Array<{
    title: string;
    completed: boolean;
  }>;
}

function TodoForm() {
  const { ref, onSubmit } = useForm<TodoForm>({
    submit: (data) => {
      console.log(data);
      // {
      //   todos: [
      //     { title: "Buy groceries", completed: false },
      //     { title: "Walk the dog", completed: true }
      //   ]
      // }
    }
  });

  return (
    <form ref={ref} onSubmit={onSubmit}>
      <input name="todos[0].title" placeholder="First todo" />
      <input name="todos[0].completed" type="checkbox" />

      <input name="todos[1].title" placeholder="Second todo" />
      <input name="todos[1].completed" type="checkbox" />

      <button type="submit">Submit</button>
    </form>
  );
}
```

## API Reference

### `useForm<T>(options)`

#### Parameters

- `options.submit: (data: T) => void` - Callback function called when form is submitted with parsed form data
- `options.initialData?: T` - Optional initial data to populate the form fields

#### Returns

- `ref: React.RefObject<HTMLFormElement>` - React ref to attach to your form element
- `onSubmit: (event: React.FormEvent<HTMLFormElement>) => void` - Form submission handler that prevents default behavior and calls submit with parsed data
- `reset: (data?: T, shouldUseInitialData?: boolean) => void` - Resets the form. If `data` is provided, sets form to that data. If `shouldUseInitialData` is true (default), falls back to initial data when no data is provided
- `getFormData: () => T | null` - Gets current form data without triggering submission (returns null if form ref is not available)
- `setValue: (name: string, value: string) => void` - Sets the value of a specific form field by name
- `initialize: (data?: T) => void` - Initializes the form with provided data or falls back to initial data from options

### Form Initialization Examples

#### Static Initial Data

```tsx
const form = useForm<UserData>({
  submit: (data) => saveUser(data),
  initialData: {
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user'
  }
});

// Initialize with predefined data on component mount
useEffect(() => {
  form.initialize(); // Uses initialData
}, []);
```

#### Dynamic Data Loading

```tsx
function EditProfile({ userId }) {
  const form = useForm<ProfileData>({
    submit: (data) => updateProfile(userId, data)
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await fetchProfile(userId);
        form.initialize(profile);
      } catch (error) {
        console.error('Failed to load profile:', error);
        // Initialize with empty data or defaults
        form.initialize({ name: '', email: '', bio: '' });
      }
    };

    if (userId) loadProfile();
  }, [userId]);

  return (
    <form ref={form.ref} onSubmit={form.onSubmit}>
      <input name="name" placeholder="Full Name" />
      <input name="email" type="email" placeholder="Email" />
      <textarea name="bio" placeholder="Bio" />
      <button type="submit">Save Profile</button>
    </form>
  );
}
```

#### Conditional Reset Behavior

```tsx
function FormWithMultipleResets() {
  const form = useForm<FormData>({
    submit: (data) => console.log(data),
    initialData: { name: 'Default Name', email: '' }
  });

  return (
    <>
      <form ref={form.ref} onSubmit={form.onSubmit}>
        <input name="name" placeholder="Name" />
        <input name="email" placeholder="Email" />
        <button type="submit">Submit</button>
      </form>

      <div>
        {/* Reset to initial data */}
        <button onClick={() => form.reset()}>Reset to Defaults</button>

        {/* Reset to custom data */}
        <button onClick={() => form.reset({ name: 'Custom Name', email: 'custom@example.com' })}>
          Reset to Custom
        </button>

        {/* Clear form completely */}
        <button onClick={() => form.reset({}, false)}>Clear Form</button>
      </div>
    </>
  );
}
```

#### Using Form Utilities

```tsx
function MyForm() {
  const form = useForm<FormData>({
    submit: (data) => console.log('Submitted:', data),
    initialData: { name: '', email: '', age: '' }
  });

  const handleReset = () => {
    form.reset(); // Reset to initial data
  };

  const handleClearForm = () => {
    form.reset({}, false); // Clear form completely
  };

  const handleResetToDefaults = () => {
    form.reset({ name: 'Default User', email: '', age: '25' }); // Reset to specific data
  };

  const handlePreview = () => {
    const currentData = form.getFormData();
    if (currentData) {
      console.log('Current form data:', currentData);
    }
  };

  const handlePrefill = () => {
    form.setValue('email', 'user@example.com');
    form.setValue('name', 'John Doe');
  };

  const handleLoadFromAPI = async () => {
    const userData = await fetchUserData();
    form.initialize(userData);
  };

  return (
    <>
      <form ref={form.ref} onSubmit={form.onSubmit}>
        <input name="name" placeholder="Name" />
        <input name="email" type="email" placeholder="Email" />
        <input name="age" type="number" placeholder="Age" />
        <button type="submit">Submit</button>
      </form>

      <div>
        <button onClick={handleReset}>Reset to Initial</button>
        <button onClick={handleClearForm}>Clear Form</button>
        <button onClick={handleResetToDefaults}>Reset to Defaults</button>
        <button onClick={handlePreview}>Preview Data</button>
        <button onClick={handlePrefill}>Prefill Form</button>
        <button onClick={handleLoadFromAPI}>Load from API</button>
      </div>
    </>
  );
}
```

### Form Data Parsing Rules

The `parseFormData` utility converts FormData into structured objects using these rules:

1. **Dot notation** creates nested objects: `user.name` → `{ user: { name: "value" } }`
2. **Bracket notation** creates arrays: `items[0]` → `{ items: ["value"] }`
3. **Combined notation** works: `users[0].name` → `{ users: [{ name: "value" }] }`

## Examples

### Contact Form

```tsx
import { useForm } from 'rfhook';

interface ContactData {
  name: string;
  email: string;
  message: string;
  preferences: {
    newsletter: boolean;
    notifications: boolean;
  };
}

function ContactForm() {
  const { ref, onSubmit } = useForm<ContactData>({
    submit: async (data) => {
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          alert('Message sent successfully!');
        }
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  });

  return (
    <form ref={ref} onSubmit={onSubmit}>
      <input name="name" placeholder="Your Name" required />
      <input name="email" type="email" placeholder="Your Email" required />
      <textarea name="message" placeholder="Your Message" required />

      <fieldset>
        <legend>Preferences</legend>
        <label>
          <input name="preferences.newsletter" type="checkbox" />
          Subscribe to newsletter
        </label>
        <label>
          <input name="preferences.notifications" type="checkbox" />
          Enable notifications
        </label>
      </fieldset>

      <button type="submit">Send Message</button>
    </form>
  );
}
```

## TypeScript Support

The hook is fully typed and supports generic type parameters for form data:

```tsx
interface MyFormData {
  // Define your form structure here
}

const { ref, submit } = useForm<MyFormData>({
  handleSubmit: (data) => {
    // data is typed as MyFormData
  }
});
```

## Browser Support

- All modern browsers that support ES2020
- React 16.8+ (hooks support required)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC

## Development

```bash
# Install dependencies
pnpm install

# Build the package
pnpm run build

# Code quality
pnpm run lint          # Check for linting issues
pnpm run lint:fix      # Auto-fix linting issues
pnpm run format        # Format code with Prettier
pnpm run format:check  # Check code formatting

# The built files will be in the `dist/` directory
```

### Code Style

This project uses:
- **ESLint** for code linting with TypeScript and React support
- **Prettier** for code formatting with these rules:
  - Single quotes
  - No semicolons
  - Trailing commas
  - 2-space indentation
  - 80 character line width
