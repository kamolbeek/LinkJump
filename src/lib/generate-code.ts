import { nanoid } from 'nanoid'
import { prisma } from './prisma'

const CODE_LENGTH = 6

export async function generateUniqueCode(): Promise<string> {
  const maxAttempts = 10

  for (let i = 0; i < maxAttempts; i++) {
    const code = nanoid(CODE_LENGTH)

    const existing = await prisma.link.findUnique({
      where: { code },
    })

    if (!existing) {
      return code
    }
  }

  throw new Error('Failed to generate unique code after maximum attempts')
}
