import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateUrl } from '@/lib/validate'
import { detectPlatform } from '@/lib/platform-detector'
import { normalizeUrl } from '@/lib/url-normalizer'
import { generateUniqueCode } from '@/lib/generate-code'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = body

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

    // Save to database
    const link = await prisma.link.create({
      data: {
        code,
        originalUrl: trimmedUrl,
        normalizedUrl,
        platform,
      },
    })

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'
    const shortUrl = `${baseUrl}/r/${link.code}`

    return NextResponse.json({
      code: link.code,
      shortUrl,
      platform: link.platform,
      originalUrl: link.originalUrl,
      normalizedUrl: link.normalizedUrl,
    })
  } catch (error) {
    console.error('Error creating link:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
