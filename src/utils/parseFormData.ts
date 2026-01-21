const ARRAY_KEY_REGEX = /^(\w+)\[(\d+)\]$/

export function parseFormData(formData: FormData): Record<string, unknown> {
  const data = Object.fromEntries(formData.entries())
  const result: Record<string, unknown> = {}

  for (const [path, value] of Object.entries(data)) {
    const keys = path.split('.')
    let current = result

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const isLastKey = i === keys.length - 1
      const arrayMatch = key.match(ARRAY_KEY_REGEX)

      // Handle array notation like items[0]
      if (arrayMatch) {
        const [, arrayKey, indexStr] = arrayMatch
        const index = parseInt(indexStr, 10)

        // Initialize array if it doesn't exist
        if (!Array.isArray(current[arrayKey])) {
          current[arrayKey] = []
        }

        const array = current[arrayKey] as unknown[]

        // Set value and continue if this is the last key
        if (isLastKey) {
          array[index] = value
          continue
        }

        // Initialize nested object and move to it
        if (!array[index] || typeof array[index] !== 'object') {
          array[index] = {}
        }

        current = array[index] as Record<string, unknown>

        continue
      }

      // Handle regular keys - set value and continue if this is the last key
      if (isLastKey) {
        current[key] = value
        continue
      }

      // Initialize nested object and move to it
      if (
        !current[key] ||
        typeof current[key] !== 'object' ||
        Array.isArray(current[key])
      ) {
        current[key] = {}
      }

      current = current[key] as Record<string, unknown>
    }
  }

  return result
}
