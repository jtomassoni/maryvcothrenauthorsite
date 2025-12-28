// Vercel serverless function for /api/admin/writings
import { PrismaClient } from '@prisma/client'
import { generateSlug, ensureUniqueSlug } from '../../../lib/slug.js'
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
    console.log(`[writings] ${req.method} request received`)
    
    const username = checkAuth(req)
    if (!username) {
      console.error('[writings] Unauthorized - no valid token')
      await prisma.$disconnect()
      return res.status(401).json({ ok: false, error: 'Unauthorized' })
    }

    console.log(`[writings] Authenticated user: ${username}`)
    // GET /api/admin/writings
    if (req.method === 'GET') {
      const { q, tag, status, sort = 'newest', page = '1', pageSize = '20' } = req.query
      
      const pageNum = parseInt(page, 10) || 1
      const pageSizeNum = Math.min(parseInt(pageSize, 10) || 20, 100)
      const skip = (pageNum - 1) * pageSizeNum

      const where = {}

      if (status && (status === 'draft' || status === 'published')) {
        where.status = status
      }

      if (q && typeof q === 'string' && q.trim()) {
        const searchTerm = q.trim()
        where.OR = [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { excerpt: { contains: searchTerm, mode: 'insensitive' } },
          { contentMarkdown: { contains: searchTerm, mode: 'insensitive' } },
        ]
      }

      if (tag && typeof tag === 'string' && tag.trim()) {
        where.tags = { has: tag.trim() }
      }

      let orderBy = {}
      if (sort === 'oldest') {
        orderBy = { createdAt: 'asc' }
      } else if (sort === 'title') {
        orderBy = { title: 'asc' }
      } else {
        orderBy = { updatedAt: 'desc' }
      }

      const [writings, total] = await Promise.all([
        prisma.writing.findMany({
          where,
          orderBy,
          skip,
          take: pageSizeNum,
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
    }

    // POST /api/admin/writings
    if (req.method === 'POST') {
      console.log('[writings] Creating new writing with data:', { 
        title: req.body?.title?.substring(0, 50),
        hasContent: !!req.body?.contentMarkdown 
      })
      
      const { title, slug, excerpt, contentMarkdown, tags, status } = req.body

      if (!title || typeof title !== 'string' || !title.trim()) {
        console.error('[writings] Validation failed: Title is required')
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
      
      finalSlug = await ensureUniqueSlug(prisma, finalSlug, null, 'writing')

      const tagsArray = Array.isArray(tags)
        ? tags.filter(t => typeof t === 'string' && t.trim()).map(t => t.trim())
        : typeof tags === 'string' && tags.trim()
          ? tags.split(',').map(t => t.trim()).filter(t => t)
          : []

      const finalStatus = status || 'draft'
      const publishedAt = finalStatus === 'published' ? new Date() : null

      console.log('[writings] Creating writing in database...')
      const writing = await prisma.writing.create({
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

      console.log('[writings] Writing created successfully:', writing.id)
      return res.status(201).json({ ok: true, writing })
    }

    // Method not allowed
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  } catch (error) {
    console.error('[writings] Error:', error)
    console.error('[writings] Error stack:', error.stack)
    console.error('[writings] Error code:', error.code)
    if (error.code === 'P2002') {
      return res.status(400).json({ ok: false, error: 'A writing with this slug already exists' })
    }
    return res.status(500).json({ 
      ok: false, 
      error: 'Internal server error',
      message: error.message 
    })
  } finally {
    await prisma.$disconnect()
  }
}

