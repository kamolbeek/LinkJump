const DOMAIN_MAP: Record<string, string> = {
  // YouTube
  'youtube.com': 'youtube',
  'www.youtube.com': 'youtube',
  'm.youtube.com': 'youtube',
  'music.youtube.com': 'youtube',
  'youtu.be': 'youtube',

  // Instagram
  'instagram.com': 'instagram',
  'www.instagram.com': 'instagram',

  // TikTok
  'tiktok.com': 'tiktok',
  'www.tiktok.com': 'tiktok',
  'vm.tiktok.com': 'tiktok',

  // Telegram
  't.me': 'telegram',
  'telegram.me': 'telegram',
  'www.telegram.me': 'telegram',

  // Twitter / X
  'x.com': 'twitter',
  'www.x.com': 'twitter',
  'twitter.com': 'twitter',
  'www.twitter.com': 'twitter',

  // Facebook
  'facebook.com': 'facebook',
  'www.facebook.com': 'facebook',
  'fb.com': 'facebook',
  'www.fb.com': 'facebook',

  // Spotify
  'spotify.com': 'spotify',
  'open.spotify.com': 'spotify',
  'www.spotify.com': 'spotify',
}

export interface DetectionResult {
  platform: string
}

export function detectPlatform(url: string): DetectionResult {
  if (!url || typeof url !== 'string') {
    return { platform: 'unknown' }
  }

  try {
    const parsedUrl = new URL(url.trim())
    const hostname = parsedUrl.hostname.toLowerCase()
    
    // Aniq moslikni tekshiramiz yoki subdomain/domain qismini qidiramiz
    if (DOMAIN_MAP[hostname]) {
      return { platform: DOMAIN_MAP[hostname] }
    }

    // Subdomainlar uchun ham tekshiruv (masalan: host.youtube.com)
    for (const [domain, platform] of Object.entries(DOMAIN_MAP)) {
      if (hostname.endsWith('.' + domain)) {
        return { platform }
      }
    }

    return { platform: 'unknown' }
  } catch {
    return { platform: 'unknown' }
  }
}
