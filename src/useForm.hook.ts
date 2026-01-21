import { useRef } from 'react'

import { parseFormData } from './utils/parseFormData'

/**
 * Configuration options for the useForm hook
 */
interface UseFormOptions<T> {
  /** Callback function called when form is submitted with parsed form data */
  submit: (data: T) => void
  /** Initial data to populate the form fields */
  initialData?: T
}

/**
 * Form element types that can have their values set programmatically
 */
type FormElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

/**
 * Return type of the useForm hook
 */
interface UseFormReturn<T> {
  /** React ref to be attached to the form element */
  ref: React.RefObject<HTMLFormElement | null>
  /** Form submission handler - prevents default and calls submit with parsed data */
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  /** Resets the form and optionally sets it to provided data or initial data */
  reset: (data?: T, shouldUseInitialData?: boolean) => void
  /** Gets current form data without triggering submission */
  getFormData: () => T | null
  /** Sets the value of a specific form field by name */
  setValue: (name: string, value: string) => void
  /** Initializes the form with provided data or initial data from options */
  initialize: (data?: T) => void
}

/**
 * A React hook for handling form state and submission with initialization support
 *
 * @template T - The expected shape of the parsed form data
 * @param options - Configuration options for the form
 * @returns Object containing form ref, handlers, and utility functions
 *
 * @example
 * Basic usage:
 * ```typescript
 * interface LoginData {
 *   email: string;
 *   password: string;
 * }
 *
 * const form = useForm<LoginData>({
 *   submit: (data) => console.log(data.email, data.password)
 * });
 *
 * return (
 *   <form ref={form.ref} onSubmit={form.onSubmit}>
 *     <input name="email" type="email" />
 *     <input name="password" type="password" />
 *     <button type="submit">Login</button>
 *   </form>
 * );
 * ```
 *
 * @example
 * With initial data:
 * ```typescript
 * const form = useForm<LoginData>({
 *   submit: (data) => console.log(data),
 *   initialData: { email: 'user@example.com', password: '' }
 * });
 *
 * // Initialize form with initial data on mount
 * useEffect(() => {
 *   form.initialize();
 * }, []);
 * ```
 *
 * @example
 * Dynamic initialization:
 * ```typescript
 * const form = useForm<UserData>({
 *   submit: (data) => saveUser(data)
 * });
 *
 * // Load and set user data from API
 * const loadUser = async (userId: string) => {
 *   const userData = await fetchUser(userId);
 *   form.initialize(userData);
 * };
 *
 * // Reset to specific data
 * const resetToDefaults = () => {
 *   form.reset({ name: '', email: '', age: '' });
 * };
 * ```
 */
export function useForm<T = Record<string, unknown>>({
  submit,
  initialData,
}: UseFormOptions<T>): UseFormReturn<T> {
  const ref = useRef<HTMLFormElement>(null)
  const initialDataRef = useRef<T | undefined>(initialData)

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!ref.current) return

    const formData = new FormData(ref.current)

    const data = parseFormData(formData) as T

    submit(data)
  }

  const reset = (data?: T, shouldUseInitialData: boolean = true) => {
    if (!ref.current) return

    ref.current.reset()

    if (data) {
      return initialize(data)
    }

    if (initialDataRef.current && shouldUseInitialData) {
      initialize(initialDataRef.current)
    }
  }

  const getFormData = (): T | null => {
    if (!ref.current) return null

    const formData = new FormData(ref.current)

    const data = parseFormData(formData) as T

    return data
  }

  const setValue = (name: string, value: string) => {
    if (!ref.current) return

    const element = ref.current.elements.namedItem(name) as FormElement | null

    if (element && 'value' in element) {
      element.value = value
    }
  }

  const initialize = (data?: T) => {
    const dataToUse = data || initialDataRef.current

    if (!ref.current || !dataToUse) return

    Object.entries(dataToUse as Record<string, unknown>).forEach(
      ([key, value]) => {
        if (value) setValue(key, String(value))
      },
    )
  }

  return {
    ref,
    getFormData,
    initialize,
    onSubmit,
    reset,
    setValue,
  }
}
