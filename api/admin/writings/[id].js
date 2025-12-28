// Vercel serverless function for /api/admin/writings/:id
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
  // Initialize Prisma client inside handler to avoid initialization issues
  const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

  try {
    const username = checkAuth(req)
    if (!username) {
      await prisma.$disconnect()
      return res.status(401).json({ ok: false, error: 'Unauthorized' })
    }

  const { id } = req.query

  try {
    // GET /api/admin/writings/:id
    if (req.method === 'GET') {
      const writing = await prisma.writing.findUnique({ where: { id } })
      
      if (!writing) {
        return res.status(404).json({ ok: false, error: 'Writing not found' })
      }
      
      return res.status(200).json({ ok: true, writing })
    }

    // PUT /api/admin/writings/:id
    if (req.method === 'PUT') {
      const { title, slug, excerpt, contentMarkdown, tags, status } = req.body

      const existing = await prisma.writing.findUnique({ where: { id } })
      if (!existing) {
        return res.status(404).json({ ok: false, error: 'Writing not found' })
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
      
      finalSlug = await ensureUniqueSlug(prisma, finalSlug, id, 'writing')

      const tagsArray = tags !== undefined
        ? (Array.isArray(tags)
            ? tags.filter(t => typeof t === 'string' && t.trim()).map(t => t.trim())
            : typeof tags === 'string' && tags.trim()
              ? tags.split(',').map(t => t.trim()).filter(t => t)
              : [])
        : existing.tags

      let publishedAt = existing.publishedAt
      if (status === 'published' && existing.status === 'draft') {
        publishedAt = new Date()
      }

      const updateData = {}
      if (title !== undefined) updateData.title = title.trim()
      if (slug !== undefined || title !== undefined) updateData.slug = finalSlug
      if (excerpt !== undefined) updateData.excerpt = excerpt.trim()
      if (contentMarkdown !== undefined) updateData.contentMarkdown = contentMarkdown.trim()
      if (tags !== undefined) updateData.tags = tagsArray
      if (status !== undefined) {
        updateData.status = status
        if (status === 'published' && !publishedAt) {
          updateData.publishedAt = new Date()
        }
      }

      const writing = await prisma.writing.update({
        where: { id },
        data: updateData,
      })

      return res.status(200).json({ ok: true, writing })
    }

    // DELETE /api/admin/writings/:id
    if (req.method === 'DELETE') {
      const existing = await prisma.writing.findUnique({ where: { id } })
      if (!existing) {
        return res.status(404).json({ ok: false, error: 'Writing not found' })
      }
      await prisma.writing.delete({ where: { id } })
      return res.status(200).json({ ok: true })
    }

    // Method not allowed
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  } catch (error) {
    console.error('Error in writing handler:', error)
    if (error.code === 'P2002') {
      return res.status(400).json({ ok: false, error: 'A writing with this slug already exists' })
    }
    return res.status(500).json({ ok: false, error: 'Internal server error' })
  } finally {
    await prisma.$disconnect()
  }
}

