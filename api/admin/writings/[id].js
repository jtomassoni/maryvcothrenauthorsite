// Vercel serverless function for /api/admin/writings/:id
export const config = {
  runtime: 'nodejs20.x',
}

import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

// Inline slug functions to avoid import issues in Vercel
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

async function ensureUniqueSlug(prisma, slug, excludeId = null) {
  if (!slug || typeof slug !== 'string' || !slug.trim()) {
    throw new Error('Slug must be a non-empty string')
  }

  let finalSlug = slug.trim()
  let counter = 1
  const maxAttempts = 100 // Prevent infinite loops

  while (counter <= maxAttempts) {
    try {
      const writing = await prisma.writing
        .findUnique({
          where: { slug: finalSlug },
          select: { id: true },
        })
        .catch((err) => {
          if (err.code === 'P2021' || err.message?.includes('does not exist')) {
            return null
          }
          throw err
        })

      const isExcluded = excludeId && writing?.id === excludeId

      if (!writing || isExcluded) {
        return finalSlug
      }

      counter++
      finalSlug = `${slug.trim()}-${counter}`
    } catch (error) {
      console.error('[ensureUniqueSlug] Error checking slug uniqueness:', error)
      throw new Error(`Failed to ensure unique slug: ${error.message}`)
    }
  }

  throw new Error(
    `Unable to generate unique slug after ${maxAttempts} attempts`
  )
}

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
  // Set content type to JSON immediately to prevent HTML fallback
  res.setHeader('Content-Type', 'application/json')
  console.log(`[admin/writings/[id]] ${req.method} ${req.url}`)

  let prisma
  try {
    // Initialize Prisma client inside handler to avoid initialization issues
    prisma = new PrismaClient({
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'error', 'warn']
          : ['error'],
    })
  } catch (initError) {
    console.error('[writings/[id]] Failed to initialize Prisma:', initError)
    return res
      .status(500)
      .json({ ok: false, error: 'Failed to initialize database connection' })
  }

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

    // GET /api/admin/writings/:id
    if (method === 'GET') {
      const writing = await prisma.writing.findUnique({ where: { id } })
      if (!writing) {
        return res.status(404).json({ ok: false, error: 'Writing not found' })
      }
      return res.status(200).json({ ok: true, writing })
    }

    // PUT /api/admin/writings/:id
    if (method === 'PUT') {
      const { title, slug, excerpt, contentMarkdown, tags, status } = req.body

      const existing = await prisma.writing.findUnique({ where: { id } })
      if (!existing) {
        return res.status(404).json({ ok: false, error: 'Writing not found' })
      }

      if (
        title !== undefined &&
        (!title || typeof title !== 'string' || !title.trim())
      ) {
        return res.status(400).json({ ok: false, error: 'Title is required' })
      }

      if (
        excerpt !== undefined &&
        (!excerpt || typeof excerpt !== 'string' || !excerpt.trim())
      ) {
        return res.status(400).json({ ok: false, error: 'Excerpt is required' })
      }

      if (
        contentMarkdown !== undefined &&
        (!contentMarkdown ||
          typeof contentMarkdown !== 'string' ||
          !contentMarkdown.trim())
      ) {
        return res.status(400).json({ ok: false, error: 'Content is required' })
      }

      if (status && status !== 'draft' && status !== 'published') {
        return res
          .status(400)
          .json({ ok: false, error: 'Status must be "draft" or "published"' })
      }

      let finalSlug =
        slug && typeof slug === 'string' && slug.trim()
          ? slug.trim()
          : title
            ? generateSlug(title)
            : existing.slug

      finalSlug = await ensureUniqueSlug(prisma, finalSlug, id)

      const tagsArray =
        tags !== undefined
          ? Array.isArray(tags)
            ? tags
                .filter((t) => typeof t === 'string' && t.trim())
                .map((t) => t.trim())
            : typeof tags === 'string' && tags.trim()
              ? tags
                  .split(',')
                  .map((t) => t.trim())
                  .filter((t) => t)
              : []
          : existing.tags

      const updateData = {}
      if (title !== undefined) updateData.title = title.trim()
      if (slug !== undefined || title !== undefined) updateData.slug = finalSlug
      if (excerpt !== undefined) updateData.excerpt = excerpt.trim()
      if (contentMarkdown !== undefined)
        updateData.contentMarkdown = contentMarkdown.trim()
      if (tags !== undefined) updateData.tags = tagsArray
      if (status !== undefined) {
        updateData.status = status
        // If changing to published and it doesn't have a publishedAt date, set it now
        if (status === 'published' && !existing.publishedAt) {
          updateData.publishedAt = new Date()
        }
      }

      const writing = await prisma.writing.update({
        where: { id },
        data: updateData,
      })

      return res.status(200).json({ ok: true, writing })
    }

    // POST /api/admin/writings/:id (for duplication)
    if (method === 'POST') {
      const original = await prisma.writing.findUnique({ where: { id } })

      if (!original) {
        return res.status(404).json({ ok: false, error: 'Writing not found' })
      }

      const newSlug = await ensureUniqueSlug(prisma, original.slug, null)
      const duplicated = await prisma.writing.create({
        data: {
          title: `${original.title} (Copy)`,
          slug: newSlug,
          excerpt: original.excerpt,
          contentMarkdown: original.contentMarkdown,
          tags: original.tags,
          status: 'draft',
          publishedAt: null,
        },
      })

      return res.status(201).json({ ok: true, writing: duplicated })
    }

    // DELETE /api/admin/writings/:id
    if (method === 'DELETE') {
      const existing = await prisma.writing.findUnique({ where: { id } })
      if (!existing) {
        return res.status(404).json({ ok: false, error: 'Writing not found' })
      }
      await prisma.writing.delete({ where: { id } })
      return res.status(200).json({ ok: true })
    }

    // Method not allowed
    return res
      .status(405)
      .json({ ok: false, error: `Method not allowed: ${method}` })
  } catch (error) {
    console.error('[writings/[id]] Error:', error)
    console.error('[writings/[id]] Error stack:', error.stack)
    console.error('[writings/[id]] Error code:', error.code)

    // Ensure we always return JSON, never HTML
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json')
    }

    // Handle Prisma table missing error (P2021)
    if (error.code === 'P2021') {
      return res.status(500).json({
        ok: false,
        error: 'Database tables not found',
        message:
          'The database tables do not exist. Please run database migrations.',
        code: error.code,
      })
    }

    // Handle Prisma unique constraint errors
    if (error.code === 'P2002') {
      return res
        .status(400)
        .json({ ok: false, error: 'A writing with this slug already exists' })
    }

    // Return more detailed error information
    const errorResponse = {
      ok: false,
      error: 'Internal server error',
      message: error.message || 'An unexpected error occurred',
    }

    // Include error code if it's a Prisma error
    if (error.code) {
      errorResponse.code = error.code
    }

    return res.status(500).json(errorResponse)
  } finally {
    if (prisma) {
      try {
        await prisma.$disconnect()
      } catch (disconnectError) {
        console.error(
          '[writings/[id]] Error disconnecting Prisma:',
          disconnectError
        )
      }
    }
  }
}
