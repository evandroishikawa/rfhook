# rfhook

A lightweight React hook for handling form submissions with advanced form data parsing capabilities. Supports nested objects, arrays, and dot notation for complex form structures.

## Features

- :rocket: **Simple API** - Just one hook to handle all your form needs
- :dart: **TypeScript Support** - Fully typed with generic support
- :wrench: **Nested Objects** - Parse nested form data with dot notation (`user.name`)
- :clipboard: **Array Support** - Handle arrays with indexed notation (`items[0]`)
- :floppy_disk: **Automatic Prevention** - Prevents default form submission behavior by default
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
      <button type="submit">Login</button>
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

#### Returns

- `ref: React.RefObject<HTMLFormElement>` - React ref to attach to your form element
- `onSubmit: (event: React.FormEvent<HTMLFormElement>) => void` - Form submission handler that prevents default behavior and calls submit with parsed data
- `reset: () => void` - Resets the form to its initial state
- `getFormData: () => T | null` - Gets current form data without triggering submission (returns null if form ref is not available)
- `setValue: (name: string, value: string) => void` - Sets the value of a specific form field by name

### Additional Usage Examples

#### Using Form Utilities

```tsx
function MyForm() {
  const form = useForm<FormData>({
    submit: (data) => console.log('Submitted:', data)
  });

  const handleReset = () => {
    form.reset(); // Reset form to initial state
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

  return (
    <>
      <form ref={form.ref} onSubmit={form.onSubmit}>
        <input name="name" placeholder="Name" />
        <input name="email" type="email" placeholder="Email" />
        <button type="submit">Submit</button>
      </form>

      <div>
        <button onClick={handleReset}>Reset Form</button>
        <button onClick={handlePreview}>Preview Data</button>
        <button onClick={handlePrefill}>Prefill Form</button>
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

# The built files will be in the `dist/` directory
```
