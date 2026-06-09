import { PlatformAdapter } from './adapters/types';
import { YoutubeAdapter } from './adapters/youtube-adapter';
import { InstagramAdapter } from './adapters/instagram-adapter';
import { TiktokAdapter } from './adapters/tiktok-adapter';
import { TelegramAdapter } from './adapters/telegram-adapter';
import { TwitterAdapter } from './adapters/twitter-adapter';
import { FacebookAdapter } from './adapters/facebook-adapter';
import { SpotifyAdapter } from './adapters/spotify-adapter';
import { UnknownAdapter } from './adapters/unknown-adapter';

export function getAdapter(platform: string, url: string): PlatformAdapter {
  const p = (platform || '').toLowerCase();
  switch (p) {
    case 'youtube':
      return new YoutubeAdapter(url);
    case 'instagram':
      return new InstagramAdapter(url);
    case 'tiktok':
      return new TiktokAdapter(url);
    case 'telegram':
      return new TelegramAdapter(url);
    case 'twitter':
      return new TwitterAdapter(url);
    case 'facebook':
      return new FacebookAdapter(url);
    case 'spotify':
      return new SpotifyAdapter(url);
    default:
      return new UnknownAdapter(url);
  }
}
