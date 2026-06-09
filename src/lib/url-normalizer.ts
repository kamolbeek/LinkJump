const TRACKING_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'fbclid',
  'gclid',
  'igshid',
  'si'
]

export function normalizeUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return url
  }

  const trimmed = url.trim()

  try {
    const parsedUrl = new URL(trimmed)
    const params = parsedUrl.searchParams

    // Tracking parametrlarni o'chirib chiqamiz
    TRACKING_PARAMS.forEach(param => {
      if (params.has(param)) {
        params.delete(param)
      }
    })

    // Tozalangan URL ni string ko'rinishida qaytaramiz
    return parsedUrl.toString()
  } catch {
    // Agar noto'g'ri URL bo'lsa, o'zini qaytaramiz
    return trimmed
  }
}
