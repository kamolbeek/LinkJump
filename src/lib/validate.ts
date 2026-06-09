export interface ValidationResult {
  valid: boolean
  error?: string
}

export function validateUrl(url: string): ValidationResult {
  if (!url || typeof url !== 'string') {
    return { valid: false, error: 'URL is required' }
  }

  const trimmed = url.trim()

  if (trimmed.length === 0) {
    return { valid: false, error: 'URL cannot be empty' }
  }

  if (trimmed.length > 2048) {
    return { valid: false, error: 'URL is too long (max 2048 characters)' }
  }

  try {
    const parsed = new URL(trimmed)

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, error: 'URL must use http or https protocol' }
    }

    if (!parsed.hostname.includes('.')) {
      return { valid: false, error: 'URL must have a valid domain' }
    }

    return { valid: true }
  } catch {
    return { valid: false, error: 'Invalid URL format' }
  }
}
