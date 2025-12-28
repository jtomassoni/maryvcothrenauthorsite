// Vercel serverless function for /api/admin/blog/posts/:id
import { PrismaClient } from '@prisma/client'
import { generateSlug, ensureUniqueSlug } from '../../../../lib/slug.js'
import jwt from 'jsonwebtoken'

// Initialize Prisma client for serverless
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

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

  const { id } = req.query

  try {
    // GET /api/admin/blog/posts/:id
    if (req.method === 'GET') {
      const post = await prisma.blogPost.findUnique({ where: { id } })
      
      if (!post) {
        return res.status(404).json({ ok: false, error: 'Post not found' })
      }
      
      return res.status(200).json({ ok: true, post })
    }

    // PUT /api/admin/blog/posts/:id
    if (req.method === 'PUT') {
      const { title, slug, excerpt, contentMarkdown, tags, status } = req.body

      const existing = await prisma.blogPost.findUnique({ where: { id } })
      if (!existing) {
        return res.status(404).json({ ok: false, error: 'Post not found' })
      }

      if (!title || typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ ok: false, error: 'Title is required' })
      }

      if (!excerpt || typeof excerpt !== 'string' || !excerpt.trim()) {
        return res.status(400).json({ ok: false, error: 'Excerpt is required' })
      }

      if (!contentMarkdown || typeof contentMarkdown !== 'string' || !contentMarkdown.trim()) {
        return res.status(400).json({ ok: false, error: 'Content is required' })
      }

      if (status && status !== 'draft' && status !== 'published') {
        return res.status(400).json({ ok: false, error: 'Status must be "draft" or "published"' })
      }

      let finalSlug = slug && typeof slug === 'string' && slug.trim()
        ? slug.trim()
        : generateSlug(title)
      
      finalSlug = await ensureUniqueSlug(prisma, finalSlug, id, 'blog')

      const tagsArray = Array.isArray(tags)
        ? tags.filter(t => typeof t === 'string' && t.trim()).map(t => t.trim())
        : typeof tags === 'string' && tags.trim()
          ? tags.split(',').map(t => t.trim()).filter(t => t)
          : []

      const finalStatus = status || existing.status
      const publishedAt = finalStatus === 'published' && existing.status !== 'published'
        ? new Date()
        : existing.publishedAt

      const post = await prisma.blogPost.update({
        where: { id },
        data: {
          title: title.trim(),
          slug: finalSlug,
          excerpt: excerpt.trim(),
          contentMarkdown: contentMarkdown.trim(),
          tags: tagsArray,
          status: finalStatus,
          publishedAt,
        },
      })

      return res.status(200).json({ ok: true, post })
    }

    // DELETE /api/admin/blog/posts/:id
    if (req.method === 'DELETE') {
      const existing = await prisma.blogPost.findUnique({ where: { id } })
      if (!existing) {
        return res.status(404).json({ ok: false, error: 'Post not found' })
      }
      await prisma.blogPost.delete({ where: { id } })
      return res.status(200).json({ ok: true })
    }

    // Method not allowed
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  } catch (error) {
    console.error('Error in blog post handler:', error)
    return res.status(500).json({ ok: false, error: 'Internal server error' })
  }
}

