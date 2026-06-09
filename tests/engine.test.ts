import { detectPlatform } from '../src/lib/platform-detector';
import { normalizeUrl } from '../src/lib/url-normalizer';
import { getAdapter } from '../src/lib/adapter-resolver';

interface TestCase {
  name: string;
  url: string;
  expectedPlatform: string;
  expectedNormalized: string;
  expectedAndroidUrl: string;
  expectedIOSUrl: string;
}

const testCases: TestCase[] = [
  // YouTube
  {
    name: 'YouTube Standard URL with Video ID',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&utm_source=test_source',
    expectedPlatform: 'youtube',
    expectedNormalized: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    expectedAndroidUrl: 'intent://www.youtube.com/watch?v=dQw4w9WgXcQ#Intent;package=com.google.android.youtube;scheme=https;end',
    expectedIOSUrl: 'youtube://watch?v=dQw4w9WgXcQ'
  },
  {
    name: 'YouTube Short URL with Video ID',
    url: 'https://youtu.be/dQw4w9WgXcQ?si=abcdef',
    expectedPlatform: 'youtube',
    expectedNormalized: 'https://youtu.be/dQw4w9WgXcQ',
    expectedAndroidUrl: 'intent://www.youtube.com/watch?v=dQw4w9WgXcQ#Intent;package=com.google.android.youtube;scheme=https;end',
    expectedIOSUrl: 'youtube://watch?v=dQw4w9WgXcQ'
  },
  {
    name: 'YouTube home (No Video ID)',
    url: 'https://www.youtube.com/',
    expectedPlatform: 'youtube',
    expectedNormalized: 'https://www.youtube.com/',
    expectedAndroidUrl: 'intent://www.youtube.com#Intent;package=com.google.android.youtube;scheme=https;end',
    expectedIOSUrl: 'youtube://'
  },
  // Instagram
  {
    name: 'Instagram with tracking params',
    url: 'https://instagram.com/reel/xyz?igshid=123',
    expectedPlatform: 'instagram',
    expectedNormalized: 'https://instagram.com/reel/xyz',
    expectedAndroidUrl: 'intent://instagram.com#Intent;package=com.instagram.android;scheme=https;end',
    expectedIOSUrl: 'instagram://'
  },
  // TikTok
  {
    name: 'TikTok video with Video ID',
    url: 'https://www.tiktok.com/@user/video/123456789?utm_medium=social',
    expectedPlatform: 'tiktok',
    expectedNormalized: 'https://www.tiktok.com/@user/video/123456789',
    expectedAndroidUrl: 'intent://tiktok.com/v/123456789#Intent;package=com.zhiliaoapp.musically;scheme=https;end',
    expectedIOSUrl: 'snssdk1128://feed?detail_id=123456789'
  },
  {
    name: 'TikTok profile (No Video ID)',
    url: 'https://tiktok.com/@username',
    expectedPlatform: 'tiktok',
    expectedNormalized: 'https://tiktok.com/@username',
    expectedAndroidUrl: 'intent://tiktok.com#Intent;package=com.zhiliaoapp.musically;scheme=https;end',
    expectedIOSUrl: 'tiktok://'
  },
  // Telegram
  {
    name: 'Telegram user/channel link',
    url: 'https://t.me/durov?utm_source=tg',
    expectedPlatform: 'telegram',
    expectedNormalized: 'https://t.me/durov',
    expectedAndroidUrl: 'tg://resolve?domain=durov',
    expectedIOSUrl: 'tg://resolve?domain=durov'
  },
  // Twitter / X
  {
    name: 'Twitter standard link',
    url: 'https://twitter.com/jack/status/20?utm_content=tweet',
    expectedPlatform: 'twitter',
    expectedNormalized: 'https://twitter.com/jack/status/20',
    expectedAndroidUrl: 'intent://twitter.com#Intent;package=com.twitter.android;scheme=https;end',
    expectedIOSUrl: 'twitter://'
  },
  // Facebook
  {
    name: 'Facebook link',
    url: 'https://www.facebook.com/photo?fbclid=xyz',
    expectedPlatform: 'facebook',
    expectedNormalized: 'https://www.facebook.com/photo',
    expectedAndroidUrl: 'intent://facebook.com#Intent;package=com.facebook.katana;scheme=https;end',
    expectedIOSUrl: 'fb://'
  },
  // Spotify
  {
    name: 'Spotify Album link',
    url: 'https://open.spotify.com/album/123?si=spotify_track_id',
    expectedPlatform: 'spotify',
    expectedNormalized: 'https://open.spotify.com/album/123',
    expectedAndroidUrl: 'spotify:album:123',
    expectedIOSUrl: 'spotify:album:123'
  },
  // Unknown Domains
  {
    name: 'Unknown domain (Should not attempt launch)',
    url: 'https://github.com/azimjohn/jprq?fbclid=xyz',
    expectedPlatform: 'unknown',
    expectedNormalized: 'https://github.com/azimjohn/jprq',
    expectedAndroidUrl: '',
    expectedIOSUrl: ''
  }
];

function runTests() {
  console.log('🧪 Starting Platform Detection, URL Normalization, Android Intent & iOS URL scheme tests...\n');
  let passedCount = 0;
  let failedCount = 0;

  testCases.forEach((tc, index) => {
    console.log(`[Test ${index + 1}] ${tc.name}`);
    
    // 1. Test Platform Detection
    const { platform } = detectPlatform(tc.url);
    const platformOk = platform === tc.expectedPlatform;
    
    // 2. Test Normalization
    const normalized = normalizeUrl(tc.url);
    const normalizedOk = normalized === tc.expectedNormalized;

    // 3. Test Adapter Resolving
    const adapter = getAdapter(platform, normalized);
    
    // 4. Test Android Launch URL
    const androidUrl = adapter.getAndroidLaunchUrl();
    const androidOk = androidUrl === tc.expectedAndroidUrl;

    // 5. Test iOS Launch URL
    const iosUrl = adapter.getIOSLaunchUrl();
    const iosOk = iosUrl === tc.expectedIOSUrl;

    // 6. Test Fallback URL
    const fallbackUrl = adapter.getFallbackUrl();
    const fallbackOk = fallbackUrl === tc.expectedNormalized;

    if (platformOk && normalizedOk && androidOk && iosOk && fallbackOk) {
      console.log(`  ✅ Passed`);
      passedCount++;
    } else {
      console.log(`  ❌ Failed`);
      if (!platformOk) {
        console.log(`     Expected Platform: "${tc.expectedPlatform}", Got: "${platform}"`);
      }
      if (!normalizedOk) {
        console.log(`     Expected Normalized URL: "${tc.expectedNormalized}"`);
        console.log(`     Got:                     "${normalized}"`);
      }
      if (!androidOk) {
        console.log(`     Expected Android URL: "${tc.expectedAndroidUrl}"`);
        console.log(`     Got:                  "${androidUrl}"`);
      }
      if (!iosOk) {
        console.log(`     Expected iOS URL:     "${tc.expectedIOSUrl}"`);
        console.log(`     Got:                  "${iosUrl}"`);
      }
      if (!fallbackOk) {
        console.log(`     Expected Fallback:    "${tc.expectedNormalized}"`);
        console.log(`     Got:                  "${fallbackUrl}"`);
      }
      failedCount++;
    }
  });

  console.log('\n--- Test Results ---');
  console.log(`Total: ${testCases.length}`);
  console.log(`Passed: 🎉 ${passedCount}`);
  console.log(`Failed: 🛑 ${failedCount}`);

  if (failedCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
