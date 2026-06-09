import { PlatformAdapter } from './types';

export class TiktokAdapter implements PlatformAdapter {
  constructor(private url: string) {}

  private getVideoId(): string | null {
    try {
      // e.g., tiktok.com/@user/video/123456789
      const match = this.url.match(/video\/(\d+)/);
      if (match && match[1]) {
        return match[1];
      }
    } catch {}
    return null;
  }

  getAndroidLaunchUrl(): string {
    const videoId = this.getVideoId();
    if (videoId) {
      return `intent://tiktok.com/v/${videoId}#Intent;package=com.zhiliaoapp.musically;scheme=https;end`;
    }
    return `intent://tiktok.com#Intent;package=com.zhiliaoapp.musically;scheme=https;end`;
  }

  getIOSLaunchUrl(): string {
    const videoId = this.getVideoId();
    if (videoId) {
      return `snssdk1128://feed?detail_id=${videoId}`;
    }
    return 'tiktok://';
  }

  getFallbackUrl(): string {
    return this.url;
  }
}
