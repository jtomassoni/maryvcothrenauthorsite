// Vercel serverless function for /api/admin/writings/:id/duplicate
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
    const original = await prisma.writing.findUnique({ where: { id } })
    
    if (!original) {
      return res.status(404).json({ ok: false, error: 'Writing not found' })
    }

    const newSlug = await ensureUniqueSlug(prisma, original.slug, null, 'writing')
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
  } catch (error) {
    console.error('Error duplicating writing:', error)
    return res.status(500).json({ ok: false, error: 'Failed to duplicate writing' })
  }
}

