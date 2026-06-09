const PLATFORM_MAP: Record<string, string> = {
  'youtube.com': 'youtube',
  'www.youtube.com': 'youtube',
  'm.youtube.com': 'youtube',
  'youtu.be': 'youtube',
  'music.youtube.com': 'youtube',
  'instagram.com': 'instagram',
  'www.instagram.com': 'instagram',
  'tiktok.com': 'tiktok',
  'www.tiktok.com': 'tiktok',
  'vm.tiktok.com': 'tiktok',
  'twitter.com': 'twitter',
  'www.twitter.com': 'twitter',
  'x.com': 'twitter',
  'www.x.com': 'twitter',
  't.me': 'telegram',
  'telegram.me': 'telegram',
  'facebook.com': 'facebook',
  'www.facebook.com': 'facebook',
  'm.facebook.com': 'facebook',
  'fb.watch': 'facebook',
  'open.spotify.com': 'spotify',
  'spotify.com': 'spotify',
  'linkedin.com': 'linkedin',
  'www.linkedin.com': 'linkedin',
}

export function detectPlatform(url: string): string {
  try {
    const hostname = new URL(url).hostname.toLowerCase()
    return PLATFORM_MAP[hostname] || 'other'
  } catch {
    return 'unknown'
  }
}

export const PLATFORM_COLORS: Record<string, string> = {
  youtube: '#FF0000',
  instagram: '#E4405F',
  tiktok: '#000000',
  twitter: '#1DA1F2',
  telegram: '#0088CC',
  facebook: '#1877F2',
  spotify: '#1DB954',
  linkedin: '#0A66C2',
  other: '#6366F1',
  unknown: '#6B7280',
}

export const PLATFORM_ICONS: Record<string, string> = {
  youtube: '▶️',
  instagram: '📸',
  tiktok: '🎵',
  twitter: '🐦',
  telegram: '✈️',
  facebook: '👤',
  spotify: '🎧',
  linkedin: '💼',
  other: '🔗',
  unknown: '🌐',
}
