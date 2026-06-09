import { PlatformAdapter } from './types';

export class YoutubeAdapter implements PlatformAdapter {
  constructor(private url: string) {}

  private getVideoId(): string | null {
    try {
      const parsed = new URL(this.url);
      if (parsed.searchParams.has('v')) {
        return parsed.searchParams.get('v');
      }
      if (parsed.hostname.toLowerCase() === 'youtu.be') {
        return parsed.pathname.substring(1);
      }
      if (parsed.pathname.includes('/shorts/')) {
        const parts = parsed.pathname.split('/shorts/');
        return parts[1]?.split('?')[0] || null;
      }
    } catch {}
    return null;
  }

  getAndroidLaunchUrl(): string {
    const videoId = this.getVideoId();
    if (videoId) {
      return `intent://www.youtube.com/watch?v=${videoId}#Intent;package=com.google.android.youtube;scheme=https;end`;
    }
    return `intent://www.youtube.com#Intent;package=com.google.android.youtube;scheme=https;end`;
  }

  getIOSLaunchUrl(): string {
    const videoId = this.getVideoId();
    if (videoId) {
      return `youtube://watch?v=${videoId}`;
    }
    return 'youtube://';
  }

  getFallbackUrl(): string {
    return this.url;
  }
}
