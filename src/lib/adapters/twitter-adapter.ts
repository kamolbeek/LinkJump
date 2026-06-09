import { PlatformAdapter } from './types';

export class TwitterAdapter implements PlatformAdapter {
  constructor(private url: string) {}

  getAndroidLaunchUrl(): string {
    return `intent://twitter.com#Intent;package=com.twitter.android;scheme=https;end`;
  }

  getIOSLaunchUrl(): string {
    return 'twitter://';
  }

  getFallbackUrl(): string {
    return this.url;
  }
}
