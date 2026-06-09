import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateUrl } from '@/lib/validate'
import { detectPlatform } from '@/lib/platform-detector'
import { normalizeUrl } from '@/lib/url-normalizer'
import { generateUniqueCode } from '@/lib/generate-code'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, maxClicks, expiresIn } = body

    // Validate URL
    const validation = validateUrl(url)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    const trimmedUrl = url.trim()

    // Detect platform
    const { platform } = detectPlatform(trimmedUrl)

    // Normalize URL
    const normalizedUrl = normalizeUrl(trimmedUrl)

    // Generate unique code
    const code = await generateUniqueCode()

    // Muddat hisoblash (expiresIn daqiqalarda keladi)
    let expiresAt: Date | null = null
    if (expiresIn && typeof expiresIn === 'number' && expiresIn > 0) {
      expiresAt = new Date(Date.now() + expiresIn * 60 * 1000)
    }

    // Bosish cheklovi
    const parsedMaxClicks = maxClicks && typeof maxClicks === 'number' && maxClicks > 0
      ? maxClicks
      : null

    // Save to database
    const link = await prisma.link.create({
      data: {
        code,
        originalUrl: trimmedUrl,
        normalizedUrl,
        platform,
        maxClicks: parsedMaxClicks,
        expiresAt,
      },
    })

    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    if (!baseUrl) {
      const protocol = request.nextUrl.protocol || 'https:'
      const host = request.headers.get('host') || 'linkjump.vercel.app'
      baseUrl = `${protocol}//${host}`
    }
    const shortUrl = `${baseUrl}/r/${link.code}`

    return NextResponse.json({
      code: link.code,
      shortUrl,
      platform: link.platform,
      originalUrl: link.originalUrl,
      normalizedUrl: link.normalizedUrl,
      maxClicks: link.maxClicks,
      expiresAt: link.expiresAt ? link.expiresAt.toISOString() : null,
    })
  } catch (error) {
    console.error('Error creating link:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
