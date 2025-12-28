// Vercel serverless function for /api/writings (public endpoint)
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

    const { q, tag, sort = 'newest', page = '1', pageSize = '10' } = req.query

    const pageNum = parseInt(page, 10) || 1
    const pageSizeNum = Math.min(parseInt(pageSize, 10) || 10, 50)
    const skip = (pageNum - 1) * pageSizeNum

    // Build where clause - only published writings
    const where = {
      status: 'published',
    }

    // Search query
    if (q && typeof q === 'string' && q.trim()) {
      const searchTerm = q.trim()
      where.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { excerpt: { contains: searchTerm, mode: 'insensitive' } },
        { contentMarkdown: { contains: searchTerm, mode: 'insensitive' } },
      ]
    }

    // Tag filter
    if (tag && typeof tag === 'string' && tag.trim()) {
      where.tags = { has: tag.trim() }
    }

    // Sort order
    let orderBy = {}
    if (sort === 'oldest') {
      orderBy = { publishedAt: 'asc' }
    } else if (sort === 'title') {
      orderBy = { title: 'asc' }
    } else {
      orderBy = { publishedAt: 'desc' }
    }

    const [writings, total] = await Promise.all([
      prisma.writing.findMany({
        where,
        orderBy,
        skip,
        take: pageSizeNum,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          contentMarkdown: true,
          tags: true,
          publishedAt: true,
          createdAt: true,
        },
      }),
      prisma.writing.count({ where }),
    ])

    return res.status(200).json({
      ok: true,
      writings,
      pagination: {
        page: pageNum,
        pageSize: pageSizeNum,
        total,
        totalPages: Math.ceil(total / pageSizeNum),
      },
    })
  } catch (error) {
    console.error('[writings] Error:', error)
    return res.status(500).json({
      ok: false,
      error: 'Failed to fetch writings',
    })
  } finally {
    await prisma.$disconnect()
  }
}
