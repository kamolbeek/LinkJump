export interface PlatformAdapter {
  getAndroidLaunchUrl(): string;
  getIOSLaunchUrl(): string;
  getFallbackUrl(): string;
}
