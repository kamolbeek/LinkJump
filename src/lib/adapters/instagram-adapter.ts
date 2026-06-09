import { PlatformAdapter } from './types';

export class InstagramAdapter implements PlatformAdapter {
  constructor(private url: string) {}

  getAndroidLaunchUrl(): string {
    return `intent://instagram.com#Intent;package=com.instagram.android;scheme=https;end`;
  }

  getIOSLaunchUrl(): string {
    return 'instagram://';
  }

  getFallbackUrl(): string {
    return this.url;
  }
}
