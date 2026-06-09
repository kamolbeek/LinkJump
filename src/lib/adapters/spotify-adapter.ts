import { PlatformAdapter } from './types';

export class SpotifyAdapter implements PlatformAdapter {
  constructor(private url: string) {}

  private getSpotifyUri(): string | null {
    try {
      const parsed = new URL(this.url);
      const parts = parsed.pathname.split('/').filter(Boolean);
      if (parts.length >= 2) {
        const type = parts[0];
        const id = parts[1];
        if (type && id) {
          return `spotify:${type}:${id}`;
        }
      }
    } catch {}
    return null;
  }

  getAndroidLaunchUrl(): string {
    const uri = this.getSpotifyUri();
    if (uri) {
      return uri;
    }
    return 'spotify://';
  }

  getIOSLaunchUrl(): string {
    const uri = this.getSpotifyUri();
    if (uri) {
      return uri;
    }
    return 'spotify://';
  }

  getFallbackUrl(): string {
    return this.url;
  }
}
