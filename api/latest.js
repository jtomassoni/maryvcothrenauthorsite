// Vercel serverless function for /api/latest (public endpoint)
import { PrismaClient } from '@prisma/client'

export default async function handler(req, res) {
  // Initialize Prisma client inside handler to avoid initialization issues
  const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ ok: false, error: 'Method not allowed' })
    }

    const limit = parseInt(req.query.limit || '3', 10)
    
    // Fetch published blog posts
    const blogPosts = await prisma.blogPost.findMany({
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
      take: limit * 2, // Get more to ensure we have enough after combining
    })

    // Fetch published writings
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
      take: limit * 2, // Get more to ensure we have enough after combining
    })

    // Combine and add type identifier
    const combined = [
      ...blogPosts.map(post => ({ ...post, type: 'blog' })),
      ...writings.map(writing => ({ ...writing, type: 'writing' })),
    ]

    // Sort by publishedAt (most recently published), fallback to updatedAt, then createdAt
    combined.sort((a, b) => {
      // Use publishedAt if available, otherwise use updatedAt, then createdAt
      const dateA = a.publishedAt 
        ? new Date(a.publishedAt).getTime() 
        : (a.updatedAt ? new Date(a.updatedAt).getTime() : new Date(a.createdAt).getTime())
      const dateB = b.publishedAt 
        ? new Date(b.publishedAt).getTime() 
        : (b.updatedAt ? new Date(b.updatedAt).getTime() : new Date(b.createdAt).getTime())
      return dateB - dateA // Descending (newest first)
    })

    const latest = combined.slice(0, limit)

    return res.status(200).json({
      ok: true,
      items: latest,
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

