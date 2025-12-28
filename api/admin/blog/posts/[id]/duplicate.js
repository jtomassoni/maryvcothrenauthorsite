// Vercel serverless function for /api/admin/blog/posts/:id/duplicate
import { prisma } from '../../../../../lib/db.js'
import { ensureUniqueSlug } from '../../../../../lib/slug.js'
import jwt from 'jsonwebtoken'

// Helper to check auth from JWT token
function checkAuth(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  const token = authHeader.substring(7)
  const secret = process.env.AUTH_SECRET
  if (!secret) return null
  
  try {
    const decoded = jwt.verify(token, secret)
    return decoded.username
  } catch (e) {
    return null
  }
}

export default async function handler(req, res) {
  const username = checkAuth(req)
  if (!username) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    const { id } = req.query
    const existing = await prisma.blogPost.findUnique({ where: { id } })
    
    if (!existing) {
      return res.status(404).json({ ok: false, error: 'Post not found' })
    }

    const newSlug = await ensureUniqueSlug(prisma, existing.slug, null, 'blog')
    const duplicated = await prisma.blogPost.create({
      data: {
        title: `${existing.title} (Copy)`,
        slug: newSlug,
        excerpt: existing.excerpt,
        contentMarkdown: existing.contentMarkdown,
        tags: existing.tags,
        status: 'draft',
        publishedAt: null,
      },
    })

    return res.status(201).json({ ok: true, post: duplicated })
  } catch (error) {
    console.error('Error duplicating blog post:', error)
    return res.status(500).json({ ok: false, error: 'Failed to duplicate blog post' })
  }
}

