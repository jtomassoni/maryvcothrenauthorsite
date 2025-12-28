// Vercel serverless function for /api/admin/blog/posts/:id
import { PrismaClient } from '@prisma/client'
import { generateSlug, ensureUniqueSlug } from '../../../../lib/slug.js'
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
  // Set content type to JSON
  res.setHeader('Content-Type', 'application/json')
  
  // Initialize Prisma client inside handler to avoid initialization issues
  const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

  try {
    // Normalize method to uppercase - that's all we need
    const method = String(req.method || '').toUpperCase()
    
    const username = checkAuth(req)
    if (!username) {
      await prisma.$disconnect()
      return res.status(401).json({ ok: false, error: 'Unauthorized' })
    }

    const { id } = req.query
    if (!id) {
      return res.status(400).json({ ok: false, error: 'ID is required' })
    }
    
    // GET /api/admin/blog/posts/:id
    if (method === 'GET') {
      const post = await prisma.blogPost.findUnique({ where: { id } })
      if (!post) {
        return res.status(404).json({ ok: false, error: 'Post not found' })
      }
      return res.status(200).json({ ok: true, post })
    }

    // PUT /api/admin/blog/posts/:id
    if (method === 'PUT') {
      const { title, slug, excerpt, contentMarkdown, tags, status } = req.body

      const existing = await prisma.blogPost.findUnique({ where: { id } })
      if (!existing) {
        return res.status(404).json({ ok: false, error: 'Post not found' })
      }

      if (title !== undefined && (!title || typeof title !== 'string' || !title.trim())) {
        return res.status(400).json({ ok: false, error: 'Title is required' })
      }

      if (excerpt !== undefined && (!excerpt || typeof excerpt !== 'string' || !excerpt.trim())) {
        return res.status(400).json({ ok: false, error: 'Excerpt is required' })
      }

      if (contentMarkdown !== undefined && (!contentMarkdown || typeof contentMarkdown !== 'string' || !contentMarkdown.trim())) {
        return res.status(400).json({ ok: false, error: 'Content is required' })
      }

      if (status && status !== 'draft' && status !== 'published') {
        return res.status(400).json({ ok: false, error: 'Status must be "draft" or "published"' })
      }

      let finalSlug = slug && typeof slug === 'string' && slug.trim()
        ? slug.trim()
        : title
          ? generateSlug(title)
          : existing.slug
      
      finalSlug = await ensureUniqueSlug(prisma, finalSlug, id, 'blog')

      const tagsArray = tags !== undefined
        ? (Array.isArray(tags)
            ? tags.filter(t => typeof t === 'string' && t.trim()).map(t => t.trim())
            : typeof tags === 'string' && tags.trim()
              ? tags.split(',').map(t => t.trim()).filter(t => t)
              : [])
        : existing.tags

      const updateData = {}
      if (title !== undefined) updateData.title = title.trim()
      if (slug !== undefined || title !== undefined) updateData.slug = finalSlug
      if (excerpt !== undefined) updateData.excerpt = excerpt.trim()
      if (contentMarkdown !== undefined) updateData.contentMarkdown = contentMarkdown.trim()
      if (tags !== undefined) updateData.tags = tagsArray
      if (status !== undefined) {
        updateData.status = status
        // If changing to published and it doesn't have a publishedAt date, set it now
        if (status === 'published' && !existing.publishedAt) {
          updateData.publishedAt = new Date()
        }
      }

      const post = await prisma.blogPost.update({
        where: { id },
        data: updateData,
      })

      return res.status(200).json({ ok: true, post })
    }

    // POST /api/admin/blog/posts/:id (for duplication)
    if (method === 'POST') {
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
    }

    // DELETE /api/admin/blog/posts/:id
    if (method === 'DELETE') {
      const existing = await prisma.blogPost.findUnique({ where: { id } })
      if (!existing) {
        return res.status(404).json({ ok: false, error: 'Post not found' })
      }
      await prisma.blogPost.delete({ where: { id } })
      return res.status(200).json({ ok: true })
    }

    // Method not allowed
    return res.status(405).json({ ok: false, error: `Method not allowed: ${method}` })
  } catch (error) {
    console.error('[blog/posts/[id]] Error:', error)
    console.error('[blog/posts/[id]] Error stack:', error.stack)
    console.error('[blog/posts/[id]] Error code:', error.code)
    
    // Ensure we always return JSON, never HTML
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json')
    }
    
    // Handle Prisma table missing error (P2021)
    if (error.code === 'P2021') {
      return res.status(500).json({
        ok: false,
        error: 'Database tables not found',
        message: 'The database tables do not exist. Please run database migrations.',
        code: error.code,
      })
    }
    
    return res.status(500).json({ 
      ok: false, 
      error: 'Internal server error',
      message: error.message || 'An unexpected error occurred'
    })
  } finally {
    if (prisma) {
      try {
        await prisma.$disconnect()
      } catch (disconnectError) {
        console.error('[blog/posts/[id]] Error disconnecting Prisma:', disconnectError)
      }
    }
  }
}

