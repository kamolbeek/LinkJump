import { PlatformAdapter } from './types';

export class TelegramAdapter implements PlatformAdapter {
  constructor(private url: string) {}

  private getUsername(): string | null {
    try {
      const parsed = new URL(this.url);
      const path = parsed.pathname.substring(1);
      return path || null;
    } catch {}
    return null;
  }

  getAndroidLaunchUrl(): string {
    const username = this.getUsername();
    if (username) {
      return `tg://resolve?domain=${username}`;
    }
    return 'tg://resolve';
  }

  getIOSLaunchUrl(): string {
    const username = this.getUsername();
    if (username) {
      return `tg://resolve?domain=${username}`;
    }
    return 'tg://resolve';
  }

  getFallbackUrl(): string {
    return this.url;
  }
}
