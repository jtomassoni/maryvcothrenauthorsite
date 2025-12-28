// Vercel serverless function for /api/latest (public endpoint)
import { PrismaClient } from '@prisma/client'

export default async function handler(req, res) {
  // Initialize Prisma client inside handler to avoid initialization issues
  const prisma = new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  })

  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ ok: false, error: 'Method not allowed' })
    }

    const limit = parseInt(req.query.limit || '3', 10)

    // Fetch published writings only
    const writings = await prisma.writing.findMany({
      where: {
        status: 'published',
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        tags: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [
        { publishedAt: 'desc' },
        { updatedAt: 'desc' }, // Fallback to updatedAt if publishedAt is null
      ],
      take: limit,
    })

    return res.status(200).json({
      ok: true,
      items: writings.map((item) => ({ ...item, type: 'writing' })),
    })
  } catch (error) {
    console.error('[latest] Error:', error)
    return res.status(500).json({
      ok: false,
      error: 'Failed to fetch latest items',
    })
  } finally {
    await prisma.$disconnect()
  }
}
