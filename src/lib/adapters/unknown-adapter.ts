import { PlatformAdapter } from './types';

export class UnknownAdapter implements PlatformAdapter {
  constructor(private url: string) {}

  getAndroidLaunchUrl(): string {
    return '';
  }

  getIOSLaunchUrl(): string {
    return '';
  }

  getFallbackUrl(): string {
    return this.url;
  }
}
