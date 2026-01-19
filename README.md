# @eji/form-hook

A lightweight React hook for handling form submissions with advanced form data parsing capabilities. Supports nested objects, arrays, and dot notation for complex form structures.

## Features

- 🚀 **Simple API** - Just one hook to handle all your form needs
- 🎯 **TypeScript Support** - Fully typed with generic support
- 🔧 **Nested Objects** - Parse nested form data with dot notation (`user.name`)
- 📋 **Array Support** - Handle arrays with indexed notation (`items[0]`)
- 📦 **Lightweight** - Zero dependencies (except React)
- 🎨 **Framework Agnostic** - Works with any form structure

## Installation

```bash
npm install @eji/form-hook
```

```bash
pnpm add @eji/form-hook
```

```bash
yarn add @eji/form-hook
```

## Quick Start

```tsx
import React from 'react';
import { useForm } from '@eji/form-hook';

interface FormData {
  email: string;
  password: string;
}

function LoginForm() {
  const { ref, submit } = useForm<FormData>({
    handleSubmit: (data) => {
      console.log(data); // { email: "user@example.com", password: "secret" }
    }
  });

  return (
    <form ref={ref} onSubmit={submit}>
      <input name="email" type="email" />
      <input name="password" type="password" />
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
  const { ref, submit } = useForm<UserForm>({
    handleSubmit: (data) => {
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
    <form ref={ref} onSubmit={submit}>
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
  const { ref, submit } = useForm<TodoForm>({
    handleSubmit: (data) => {
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
    <form ref={ref} onSubmit={submit}>
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

- `options.handleSubmit: (data: T) => void` - Callback function called when form is submitted

#### Returns

- `ref: RefObject<HTMLFormElement>` - React ref to attach to your form element
- `submit: (event: React.FormEvent) => void` - Submit handler to attach to form's `onSubmit`

### Form Data Parsing Rules

The `parseFormData` utility converts FormData into structured objects using these rules:

1. **Dot notation** creates nested objects: `user.name` → `{ user: { name: "value" } }`
2. **Bracket notation** creates arrays: `items[0]` → `{ items: ["value"] }`
3. **Combined notation** works: `users[0].name` → `{ users: [{ name: "value" }] }`

## Examples

### Contact Form

```tsx
import { useForm } from '@eji/form-hook';

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
  const { ref, submit } = useForm<ContactData>({
    handleSubmit: async (data) => {
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
    <form ref={ref} onSubmit={submit}>
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
