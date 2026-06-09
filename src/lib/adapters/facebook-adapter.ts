import { PlatformAdapter } from './types';

export class FacebookAdapter implements PlatformAdapter {
  constructor(private url: string) {}

  getAndroidLaunchUrl(): string {
    return `intent://facebook.com#Intent;package=com.facebook.katana;scheme=https;end`;
  }

  getIOSLaunchUrl(): string {
    return 'fb://';
  }

  getFallbackUrl(): string {
    return this.url;
  }
}
