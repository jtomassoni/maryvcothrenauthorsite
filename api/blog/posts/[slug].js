// Vercel serverless function for /api/blog/posts/[slug] (public endpoint)
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

    const { slug } = req.query

    if (!slug || typeof slug !== 'string') {
      return res.status(400).json({
        ok: false,
        error: 'Slug is required',
      })
    }

    const post = await prisma.blogPost.findFirst({
      where: {
        slug,
        status: 'published',
      },
    })

    if (!post) {
      return res.status(404).json({
        ok: false,
        error: 'Post not found',
      })
    }

    return res.status(200).json({
      ok: true,
      post,
    })
  } catch (error) {
    console.error('[blog/posts/[slug]] Error:', error)
    return res.status(500).json({
      ok: false,
      error: 'Failed to fetch blog post',
    })
  } finally {
    await prisma.$disconnect()
  }
}

