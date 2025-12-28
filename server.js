import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { prisma } from './lib/db.js'
import { 
  createSession, 
  setAuthCookie, 
  clearAuthCookie, 
  getSession, 
  requireAuth 
} from './lib/auth.js'
import { generateSlug, ensureUniqueSlug } from './lib/slug.js'
import { timingSafeEqual } from 'crypto'

// Handle uncaught errors to prevent server from crashing
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error)
  // Don't exit - keep server running
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
  // Don't exit - keep server running
})

// Load environment variables
const envResult = dotenv.config({ path: '.env.local' })

if (envResult.error) {
  console.warn('⚠️  Warning: Could not load .env.local file:', envResult.error.message)
  console.warn('   Make sure .env.local exists in the project root')
} else {
  console.log('✅ Loaded environment variables from .env.local')
}

// Log auth configuration status (without revealing values)
console.log('\n📋 Auth Configuration:')
console.log('   AUTH_USERNAME:', process.env.AUTH_USERNAME ? `✅ Set (${process.env.AUTH_USERNAME.length} chars)` : '❌ NOT SET')
console.log('   AUTH_PASSWORD:', process.env.AUTH_PASSWORD ? `✅ Set (${process.env.AUTH_PASSWORD.length} chars)` : '❌ NOT SET')
console.log('   AUTH_SECRET:', process.env.AUTH_SECRET ? `✅ Set` : '⚠️  NOT SET (using fallback in dev)')

// Log database configuration
console.log('\n📊 Database Configuration:')
const dbUrl = process.env.DATABASE_URL || ''
if (dbUrl) {
  const isLocal = dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1') || dbUrl.includes('5432')
  const isNeon = dbUrl.includes('neon.tech') || dbUrl.includes('neon')
  if (isLocal) {
    console.log('   DATABASE_URL: ✅ Set (Local Postgres)')
  } else if (isNeon) {
    console.log('   DATABASE_URL: ✅ Set (Neon Postgres)')
  } else {
    console.log('   DATABASE_URL: ✅ Set (Custom)')
  }
} else {
  console.log('   DATABASE_URL: ❌ NOT SET')
  console.error('   ⚠️  DATABASE_URL is required!')
}

// Log email service configuration
console.log('\n📧 Email Service Configuration:')
console.log('   RESEND_API_KEY:', process.env.RESEND_API_KEY ? `✅ Set (${process.env.RESEND_API_KEY.length} chars)` : '❌ NOT SET')
const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
const fromName = process.env.RESEND_FROM_NAME || 'Mary V Cothren'
console.log('   RESEND_FROM_EMAIL:', fromEmail)
console.log('   RESEND_FROM_NAME:', fromName)
if (!process.env.RESEND_FROM_EMAIL) {
  console.log('   ℹ️  Using test domain (onboarding@resend.dev) - set RESEND_FROM_EMAIL to use your verified domain')
}
console.log('')

const app = express()
const PORT = 3001

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://www.maryvcothren.com' 
    : 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

// Simple in-memory rate limiting
const rateLimitMap = new Map()
const loginRateLimitMap = new Map()

const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 5
const LOGIN_RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
const LOGIN_RATE_LIMIT_MAX_ATTEMPTS = 10

function checkRateLimit(ip) {
  const now = Date.now()
  const userLimit = rateLimitMap.get(ip)

  if (!userLimit) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (now > userLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }

  userLimit.count++
  return true
}

function checkLoginRateLimit(ip) {
  const now = Date.now()
  const userLimit = loginRateLimitMap.get(ip)

  if (!userLimit) {
    loginRateLimitMap.set(ip, { count: 1, resetTime: now + LOGIN_RATE_LIMIT_WINDOW, lastFailure: 0 })
    return { allowed: true, delay: 0 }
  }

  if (now > userLimit.resetTime) {
    loginRateLimitMap.set(ip, { count: 1, resetTime: now + LOGIN_RATE_LIMIT_WINDOW, lastFailure: 0 })
    return { allowed: true, delay: 0 }
  }

  if (userLimit.count >= LOGIN_RATE_LIMIT_MAX_ATTEMPTS) {
    return { allowed: false, delay: 0 }
  }

  // Add exponential backoff delay for repeated failures
  const timeSinceLastFailure = now - userLimit.lastFailure
  const delay = Math.min(1000 * Math.pow(2, userLimit.count - 1), 5000) // Max 5 seconds
  
  if (timeSinceLastFailure < delay) {
    return { allowed: false, delay: delay - timeSinceLastFailure }
  }

  userLimit.count++
  return { allowed: true, delay: 0 }
}

function recordLoginFailure(ip) {
  const now = Date.now()
  const userLimit = loginRateLimitMap.get(ip)
  if (userLimit) {
    userLimit.lastFailure = now
  }
}

function validateInput(data) {
  const errors = []

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long')
  }

  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required')
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      errors.push('Please provide a valid email address')
    }
  }

  if (data.message && typeof data.message === 'string' && data.message.length > 1000) {
    errors.push('Message must be less than 1000 characters')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true, status: 'healthy' })
})

// ============================================================================
// AUTH HELPERS
// ============================================================================

// Helper to check JWT token from Authorization header
function checkJWTToken(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization
  if (!authHeader || (!authHeader.startsWith('Bearer ') && !authHeader.startsWith('bearer '))) {
    return null
  }
  
  const token = authHeader.substring(7) // Remove 'Bearer ' or 'bearer ' prefix
  const JWT_SECRET = process.env.AUTH_SECRET
  if (!JWT_SECRET) return null
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded.username
  } catch (e) {
    return null
  }
}

// Enhanced requireAuth that checks both cookies and JWT tokens
function requireAuthEnhanced(req, res, next) {
  // First try JWT token from Authorization header (for frontend)
  const jwtUsername = checkJWTToken(req)
  if (jwtUsername) {
    req.user = jwtUsername
    return next()
  }
  
  // Fall back to cookie-based session (for backward compatibility)
  const session = getSession(req)
  if (session && session.u) {
    req.user = session.u
    return next()
  }
  
  return res.status(401).json({ ok: false, error: 'Unauthorized' })
}

// ============================================================================
// AUTH ENDPOINTS
// ============================================================================

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown'
    const rateLimit = checkLoginRateLimit(clientIP)
    
    if (!rateLimit.allowed) {
      if (rateLimit.delay > 0) {
        await new Promise(resolve => setTimeout(resolve, rateLimit.delay))
      }
      return res.status(429).json({
        ok: false,
        error: 'Too many login attempts. Please try again later.',
      })
    }

    const { username, password } = req.body

    if (!username || !password) {
      recordLoginFailure(clientIP)
      return res.status(400).json({
        ok: false,
        error: 'Username and password are required',
      })
    }

    const AUTH_USERNAME = process.env.AUTH_USERNAME
    const AUTH_PASSWORD = process.env.AUTH_PASSWORD

    // Diagnostic logging (only in development)
    if (process.env.NODE_ENV !== 'production') {
      console.log('Login attempt:')
      console.log('  Username provided:', username)
      console.log('  AUTH_USERNAME set:', !!AUTH_USERNAME, AUTH_USERNAME ? `(length: ${AUTH_USERNAME.length})` : 'NOT SET')
      console.log('  AUTH_PASSWORD set:', !!AUTH_PASSWORD, AUTH_PASSWORD ? '(length: ' + AUTH_PASSWORD.length + ')' : 'NOT SET')
      console.log('  AUTH_SECRET set:', !!process.env.AUTH_SECRET)
    }

    if (!AUTH_USERNAME || !AUTH_PASSWORD) {
      console.error('❌ AUTH_USERNAME and AUTH_PASSWORD must be set in .env.local')
      console.error('   Make sure your .env.local file exists and contains:')
      console.error('   AUTH_USERNAME=your_username')
      console.error('   AUTH_PASSWORD=your_password')
      return res.status(500).json({
        ok: false,
        error: 'Authentication is not configured. Check server logs.',
      })
    }

    // Constant-time comparison to avoid timing attacks
    const usernameMatch = username.length === AUTH_USERNAME.length &&
      timingSafeEqual(Buffer.from(username), Buffer.from(AUTH_USERNAME))
    const passwordMatch = password.length === AUTH_PASSWORD.length &&
      timingSafeEqual(Buffer.from(password), Buffer.from(AUTH_PASSWORD))

    if (!usernameMatch || !passwordMatch) {
      recordLoginFailure(clientIP)
      // Add a small delay to prevent brute force
      await new Promise(resolve => setTimeout(resolve, 500))
      return res.status(401).json({
        ok: false,
        error: 'Invalid username or password',
      })
    }

    // Reset rate limit on successful login
    loginRateLimitMap.delete(clientIP)

    // Create session cookie (for backward compatibility)
    const sessionToken = createSession(username)
    setAuthCookie(res, sessionToken)

    // Also generate JWT token for frontend (matches production behavior)
    const JWT_SECRET = process.env.AUTH_SECRET
    if (!JWT_SECRET) {
      console.error('Login: AUTH_SECRET not properly configured')
      return res.status(500).json({
        ok: false,
        error: 'Server configuration error. Please contact administrator.',
      })
    }

    const jwtToken = jwt.sign(
      { username },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    console.log('Login: Token generated successfully for user:', username)

    return res.status(200).json({ 
      ok: true, 
      token: jwtToken,
      username 
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({
      ok: false,
      error: 'An error occurred during login',
    })
  }
})

// POST /api/auth/logout
app.post('/api/auth/logout', (req, res) => {
  clearAuthCookie(res)
  return res.status(200).json({ ok: true })
})

// GET /api/auth/check
app.get('/api/auth/check', (req, res) => {
  // Check JWT token first (matches production behavior)
  const authHeader = req.headers.authorization || req.headers.Authorization
  if (authHeader && (authHeader.startsWith('Bearer ') || authHeader.startsWith('bearer '))) {
    const token = authHeader.substring(7)
    const JWT_SECRET = process.env.AUTH_SECRET
    
    if (JWT_SECRET) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET)
        return res.status(200).json({
          ok: true,
          authenticated: true,
          username: decoded.username
        })
      } catch (jwtError) {
        // JWT invalid, fall through to check cookies
      }
    }
  }
  
  // Fall back to cookie-based session check
  const session = getSession(req)
  return res.status(200).json({
    ok: true,
    authenticated: !!session,
    username: session?.u || null
  })
})

// ============================================================================
// PUBLIC BLOG ENDPOINTS
// ============================================================================

// GET /api/blog/posts
app.get('/api/blog/posts', async (req, res) => {
  try {
    const { q, tag, sort = 'newest', page = '1', pageSize = '10' } = req.query
    
    const pageNum = parseInt(page, 10) || 1
    const pageSizeNum = Math.min(parseInt(pageSize, 10) || 10, 50)
    const skip = (pageNum - 1) * pageSizeNum

    // Build where clause - only published posts
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

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy,
        skip,
        take: pageSizeNum,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          tags: true,
          publishedAt: true,
          createdAt: true,
        },
      }),
      prisma.blogPost.count({ where }),
    ])

    return res.status(200).json({
      ok: true,
      posts,
      pagination: {
        page: pageNum,
        pageSize: pageSizeNum,
        total,
        totalPages: Math.ceil(total / pageSizeNum),
      },
    })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return res.status(500).json({
      ok: false,
      error: 'Failed to fetch blog posts',
    })
  }
})

// GET /api/writings
app.get('/api/writings', async (req, res) => {
  try {
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
    console.error('Error fetching writings:', error)
    return res.status(500).json({
      ok: false,
      error: 'Failed to fetch writings',
    })
  }
})

// GET /api/writings/:slug
app.get('/api/writings/:slug', async (req, res) => {
  try {
    const { slug } = req.params

    const writing = await prisma.writing.findUnique({
      where: {
        slug,
        status: 'published',
      },
    })

    if (!writing) {
      return res.status(404).json({
        ok: false,
        error: 'Writing not found',
      })
    }

    return res.status(200).json({
      ok: true,
      writing,
    })
  } catch (error) {
    console.error('Error fetching writing:', error)
    return res.status(500).json({
      ok: false,
      error: 'Failed to fetch writing',
    })
  }
})

// GET /api/blog/posts/:slug
app.get('/api/blog/posts/:slug', async (req, res) => {
  try {
    const { slug } = req.params

    const post = await prisma.blogPost.findUnique({
      where: {
        slug,
        status: 'published',
        publishedAt: { not: null },
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
    console.error('Error fetching blog post:', error)
    return res.status(500).json({
      ok: false,
      error: 'Failed to fetch blog post',
    })
  }
})

// GET /api/latest - Combined latest blog posts and writings
app.get('/api/latest', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || '3', 10)
    
    // Fetch published blog posts (include those without publishedAt for backwards compatibility)
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

    // Fetch published writings (include those without publishedAt for backwards compatibility)
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
    console.error('Error fetching latest items:', error)
    return res.status(500).json({
      ok: false,
      error: 'Failed to fetch latest items',
    })
  }
})

// ============================================================================
// ADMIN BLOG ENDPOINTS
// ============================================================================

// GET /api/admin/blog/posts
app.get('/api/admin/blog/posts', requireAuthEnhanced, async (req, res) => {
  try {
    const { q, tag, status, sort = 'newest', page = '1', pageSize = '20' } = req.query
    
    const pageNum = parseInt(page, 10) || 1
    const pageSizeNum = Math.min(parseInt(pageSize, 10) || 20, 100)
    const skip = (pageNum - 1) * pageSizeNum

    // Build where clause - includes drafts
    const where = {}

    if (status && (status === 'draft' || status === 'published')) {
      where.status = status
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
      orderBy = { createdAt: 'asc' }
    } else if (sort === 'title') {
      orderBy = { title: 'asc' }
    } else {
      orderBy = { updatedAt: 'desc' }
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy,
        skip,
        take: pageSizeNum,
      }),
      prisma.blogPost.count({ where }),
    ])

    return res.status(200).json({
      ok: true,
      posts,
      pagination: {
        page: pageNum,
        pageSize: pageSizeNum,
        total,
        totalPages: Math.ceil(total / pageSizeNum),
      },
    })
  } catch (error) {
    console.error('Error fetching admin blog posts:', error)
    return res.status(500).json({
      ok: false,
      error: 'Failed to fetch blog posts',
    })
  }
})

// GET /api/admin/blog/posts/:id
app.get('/api/admin/blog/posts/:id', requireAuthEnhanced, async (req, res) => {
  try {
    const { id } = req.params

    const post = await prisma.blogPost.findUnique({
      where: { id },
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
    console.error('Error fetching blog post:', error)
    return res.status(500).json({
      ok: false,
      error: 'Failed to fetch blog post',
    })
  }
})

// POST /api/admin/blog/posts
app.post('/api/admin/blog/posts', requireAuthEnhanced, async (req, res) => {
  try {
    const { title, slug, excerpt, contentMarkdown, tags, status } = req.body

    // Validation
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        ok: false,
        error: 'Title is required',
      })
    }

    if (!excerpt || typeof excerpt !== 'string' || !excerpt.trim()) {
      return res.status(400).json({
        ok: false,
        error: 'Excerpt is required',
      })
    }

    if (!contentMarkdown || typeof contentMarkdown !== 'string' || !contentMarkdown.trim()) {
      return res.status(400).json({
        ok: false,
        error: 'Content is required',
      })
    }

    if (status && status !== 'draft' && status !== 'published') {
      return res.status(400).json({
        ok: false,
        error: 'Status must be "draft" or "published"',
      })
    }

    // Generate slug if not provided
    let finalSlug = slug && typeof slug === 'string' && slug.trim()
      ? slug.trim()
      : generateSlug(title)
    
    // Ensure unique slug
    finalSlug = await ensureUniqueSlug(prisma, finalSlug, null, 'blog')

    // Process tags
    const tagsArray = Array.isArray(tags)
      ? tags.filter(t => typeof t === 'string' && t.trim()).map(t => t.trim())
      : typeof tags === 'string' && tags.trim()
        ? tags.split(',').map(t => t.trim()).filter(t => t)
        : []

    const finalStatus = status || 'draft'
    const publishedAt = finalStatus === 'published' ? new Date() : null

    const post = await prisma.blogPost.create({
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

    return res.status(201).json({
      ok: true,
      post,
    })
  } catch (error) {
    console.error('Error creating blog post:', error)
    if (error.code === 'P2002') {
      return res.status(400).json({
        ok: false,
        error: 'A post with this slug already exists',
      })
    }
    return res.status(500).json({
      ok: false,
      error: 'Failed to create blog post',
    })
  }
})

// PUT /api/admin/blog/posts/:id
app.put('/api/admin/blog/posts/:id', requireAuthEnhanced, async (req, res) => {
  try {
    const { id } = req.params
    const { title, slug, excerpt, contentMarkdown, tags, status } = req.body

    // Check if post exists
    const existing = await prisma.blogPost.findUnique({
      where: { id },
    })

    if (!existing) {
      return res.status(404).json({
        ok: false,
        error: 'Post not found',
      })
    }

    // Validation
    if (title !== undefined && (!title || typeof title !== 'string' || !title.trim())) {
      return res.status(400).json({
        ok: false,
        error: 'Title is required',
      })
    }

    if (excerpt !== undefined && (!excerpt || typeof excerpt !== 'string' || !excerpt.trim())) {
      return res.status(400).json({
        ok: false,
        error: 'Excerpt is required',
      })
    }

    if (contentMarkdown !== undefined && (!contentMarkdown || typeof contentMarkdown !== 'string' || !contentMarkdown.trim())) {
      return res.status(400).json({
        ok: false,
        error: 'Content is required',
      })
    }

    if (status && status !== 'draft' && status !== 'published') {
      return res.status(400).json({
        ok: false,
        error: 'Status must be "draft" or "published"',
      })
    }

    // Handle slug
    let finalSlug = slug && typeof slug === 'string' && slug.trim()
      ? slug.trim()
      : title
        ? generateSlug(title)
        : existing.slug
    
    // Ensure unique slug (excluding current post)
    finalSlug = await ensureUniqueSlug(prisma, finalSlug, id, 'blog')

    // Process tags
    const tagsArray = tags !== undefined
      ? (Array.isArray(tags)
          ? tags.filter(t => typeof t === 'string' && t.trim()).map(t => t.trim())
          : typeof tags === 'string' && tags.trim()
            ? tags.split(',').map(t => t.trim()).filter(t => t)
            : [])
      : existing.tags

    // Handle status change and publishedAt
    let publishedAt = existing.publishedAt
    if (status === 'published' && existing.status === 'draft') {
      // Publishing for the first time
      publishedAt = new Date()
    }
    // If reverting to draft, keep publishedAt (as per requirements)

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

    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData,
    })

    return res.status(200).json({
      ok: true,
      post,
    })
  } catch (error) {
    console.error('Error updating blog post:', error)
    if (error.code === 'P2002') {
      return res.status(400).json({
        ok: false,
        error: 'A post with this slug already exists',
      })
    }
    return res.status(500).json({
      ok: false,
      error: 'Failed to update blog post',
    })
  }
})

// ============================================================================
// ADMIN WRITINGS ENDPOINTS
// ============================================================================

// GET /api/admin/writings
app.get('/api/admin/writings', requireAuthEnhanced, async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Error fetching admin writings:', error)
    return res.status(500).json({
      ok: false,
      error: 'Failed to fetch writings',
    })
  }
})

// GET /api/admin/writings/:id
app.get('/api/admin/writings/:id', requireAuthEnhanced, async (req, res) => {
  try {
    const { id } = req.params

    const writing = await prisma.writing.findUnique({
      where: { id },
    })

    if (!writing) {
      return res.status(404).json({
        ok: false,
        error: 'Writing not found',
      })
    }

    return res.status(200).json({
      ok: true,
      writing,
    })
  } catch (error) {
    console.error('Error fetching writing:', error)
    return res.status(500).json({
      ok: false,
      error: 'Failed to fetch writing',
    })
  }
})

// POST /api/admin/writings
app.post('/api/admin/writings', requireAuthEnhanced, async (req, res) => {
  try {
    const { title, slug, excerpt, contentMarkdown, tags, status } = req.body

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        ok: false,
        error: 'Title is required',
      })
    }

    if (!excerpt || typeof excerpt !== 'string' || !excerpt.trim()) {
      return res.status(400).json({
        ok: false,
        error: 'Excerpt is required',
      })
    }

    if (!contentMarkdown || typeof contentMarkdown !== 'string' || !contentMarkdown.trim()) {
      return res.status(400).json({
        ok: false,
        error: 'Content is required',
      })
    }

    if (status && status !== 'draft' && status !== 'published') {
      return res.status(400).json({
        ok: false,
        error: 'Status must be "draft" or "published"',
      })
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

    return res.status(201).json({
      ok: true,
      writing,
    })
  } catch (error) {
    console.error('Error creating writing:', error)
    if (error.code === 'P2002') {
      return res.status(400).json({
        ok: false,
        error: 'A writing with this slug already exists',
      })
    }
    return res.status(500).json({
      ok: false,
      error: 'Failed to create writing',
    })
  }
})

// PUT /api/admin/writings/:id
app.put('/api/admin/writings/:id', requireAuthEnhanced, async (req, res) => {
  try {
    const { id } = req.params
    const { title, slug, excerpt, contentMarkdown, tags, status } = req.body

    const existing = await prisma.writing.findUnique({
      where: { id },
    })

    if (!existing) {
      return res.status(404).json({
        ok: false,
        error: 'Writing not found',
      })
    }

    if (title !== undefined && (!title || typeof title !== 'string' || !title.trim())) {
      return res.status(400).json({
        ok: false,
        error: 'Title is required',
      })
    }

    if (excerpt !== undefined && (!excerpt || typeof excerpt !== 'string' || !excerpt.trim())) {
      return res.status(400).json({
        ok: false,
        error: 'Excerpt is required',
      })
    }

    if (contentMarkdown !== undefined && (!contentMarkdown || typeof contentMarkdown !== 'string' || !contentMarkdown.trim())) {
      return res.status(400).json({
        ok: false,
        error: 'Content is required',
      })
    }

    if (status && status !== 'draft' && status !== 'published') {
      return res.status(400).json({
        ok: false,
        error: 'Status must be "draft" or "published"',
      })
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

    return res.status(200).json({
      ok: true,
      writing,
    })
  } catch (error) {
    console.error('Error updating writing:', error)
    if (error.code === 'P2002') {
      return res.status(400).json({
        ok: false,
        error: 'A writing with this slug already exists',
      })
    }
    return res.status(500).json({
      ok: false,
      error: 'Failed to update writing',
    })
  }
})

// DELETE /api/admin/writings/:id
app.delete('/api/admin/writings/:id', requireAuthEnhanced, async (req, res) => {
  try {
    const { id } = req.params

    const existing = await prisma.writing.findUnique({
      where: { id },
    })

    if (!existing) {
      return res.status(404).json({
        ok: false,
        error: 'Writing not found',
      })
    }

    await prisma.writing.delete({
      where: { id },
    })

    return res.status(200).json({
      ok: true,
    })
  } catch (error) {
    console.error('Error deleting writing:', error)
    return res.status(500).json({
      ok: false,
      error: 'Failed to delete writing',
    })
  }
})

// POST /api/admin/writings/:id/duplicate
app.post('/api/admin/writings/:id/duplicate', requireAuthEnhanced, async (req, res) => {
  try {
    const { id } = req.params

    const original = await prisma.writing.findUnique({
      where: { id },
    })

    if (!original) {
      return res.status(404).json({
        ok: false,
        error: 'Writing not found',
      })
    }

    const newTitle = `${original.title} (Copy)`
    let newSlug = await ensureUniqueSlug(prisma, generateSlug(newTitle), null, 'writing')

    const duplicate = await prisma.writing.create({
      data: {
        title: newTitle,
        slug: newSlug,
        excerpt: original.excerpt,
        contentMarkdown: original.contentMarkdown,
        tags: original.tags,
        status: 'draft',
        publishedAt: null,
      },
    })

    return res.status(201).json({
      ok: true,
      writing: duplicate,
    })
  } catch (error) {
    console.error('Error duplicating writing:', error)
    if (error.code === 'P2002') {
      return res.status(400).json({
        ok: false,
        error: 'A writing with this slug already exists',
      })
    }
    return res.status(500).json({
      ok: false,
      error: 'Failed to duplicate writing',
    })
  }
})

// POST /api/admin/blog/posts/:id/duplicate
app.post('/api/admin/blog/posts/:id/duplicate', requireAuthEnhanced, async (req, res) => {
  try {
    const { id } = req.params

    // Get the original post
    const original = await prisma.blogPost.findUnique({
      where: { id },
    })

    if (!original) {
      return res.status(404).json({
        ok: false,
        error: 'Post not found',
      })
    }

    // Generate a new slug based on the original title
    const newTitle = `${original.title} (Copy)`
    let newSlug = await ensureUniqueSlug(prisma, generateSlug(newTitle), null, 'blog')

    // Create the duplicate as a draft
    const duplicate = await prisma.blogPost.create({
      data: {
        title: newTitle,
        slug: newSlug,
        excerpt: original.excerpt,
        contentMarkdown: original.contentMarkdown,
        tags: original.tags,
        status: 'draft', // Always duplicate as draft
        publishedAt: null, // Reset published date
      },
    })

    return res.status(201).json({
      ok: true,
      post: duplicate,
    })
  } catch (error) {
    console.error('Error duplicating blog post:', error)
    if (error.code === 'P2002') {
      return res.status(400).json({
        ok: false,
        error: 'A post with this slug already exists',
      })
    }
    return res.status(500).json({
      ok: false,
      error: 'Failed to duplicate blog post',
    })
  }
})

// DELETE /api/admin/blog/posts/:id
app.delete('/api/admin/blog/posts/:id', requireAuthEnhanced, async (req, res) => {
  try {
    const { id } = req.params

    const existing = await prisma.blogPost.findUnique({
      where: { id },
    })

    if (!existing) {
      return res.status(404).json({
        ok: false,
        error: 'Post not found',
      })
    }

    await prisma.blogPost.delete({
      where: { id },
    })

    return res.status(200).json({
      ok: true,
    })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return res.status(500).json({
      ok: false,
      error: 'Failed to delete blog post',
    })
  }
})

// ============================================================================
// CONTACT FORM ENDPOINT
// ============================================================================

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown'

    if (!checkRateLimit(clientIP)) {
      return res.status(429).json({ 
        ok: false, 
        error: 'Too many requests. Please try again later.' 
      })
    }

    const { name, email, message } = req.body

    const validation = validateInput({ name, email, message })
    if (!validation.isValid) {
      return res.status(400).json({ 
        ok: false, 
        error: validation.errors.join(', ') 
      })
    }

    // Use Resend API
    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      console.error('❌ RESEND_API_KEY not set in environment variables')
      return res.status(500).json({ 
        ok: false, 
        error: 'Email service not configured. Please contact the administrator.' 
      })
    }
    const recipientEmail = 'maryvcothren@gmail.com'
    
    // Use verified domain email if set, otherwise use Resend's test domain
    // For development: use onboarding@resend.dev (no verification needed)
    // For production: verify your domain at https://resend.com/domains and use your domain email
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
    const fromName = process.env.RESEND_FROM_NAME || 'Mary V Cothren'
    
    console.log(`📧 Sending email from: ${fromName} <${fromEmail}>`)
    console.log(`📧 Sending email to: ${recipientEmail}`)

    // Determine if this is a contact message or mailing list signup
    const hasMessage = message && message.trim().length > 0
    const subject = hasMessage 
      ? `New contact form message from ${name.trim()}`
      : `New mailing list signup from ${name.trim()}`
    const title = hasMessage 
      ? 'New Contact Form Message'
      : 'New Mailing List Signup'

    // Build email HTML
    let emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e293b;">${title}</h2>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${name.trim()}</p>
          <p><strong>Email:</strong> ${email.trim()}</p>
    `
    
    if (hasMessage) {
      emailHtml += `
          <p><strong>Message:</strong></p>
          <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px; white-space: pre-wrap;">${message.trim().replace(/\n/g, '<br>')}</div>
      `
    }
    
    emailHtml += `
          <p style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e2e8f0;"><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `

    // Send email via Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: [recipientEmail],
        subject: subject,
        html: emailHtml
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Resend API error:', errorText)
      console.error(`   Status: ${response.status}`)
      console.error(`   From email used: ${fromEmail}`)
      
      // Provide helpful error message
      let errorMessage = 'Failed to send email. Please try again later.'
      try {
        const errorData = JSON.parse(errorText)
        if (errorData.message) {
          errorMessage = errorData.message
          // If domain not verified, provide helpful guidance
          if (errorData.message.includes('domain is not verified')) {
            console.error('   💡 Tip: Make sure your domain is verified at https://resend.com/domains')
            console.error('   💡 Or use onboarding@resend.dev for testing (set RESEND_FROM_EMAIL=onboarding@resend.dev)')
          }
        }
      } catch (e) {
        // If error text is not JSON, use it as-is
        errorMessage = errorText
      }
      
      throw new Error(`Resend API error: ${response.status} - ${errorMessage}`)
    }

    const emailData = await response.json()
    console.log(`Email sent successfully for ${email.trim()} at ${new Date().toISOString()}`)

    return res.status(200).json({ ok: true })

  } catch (error) {
    console.error('Email sending error:', error)
    return res.status(500).json({ 
      ok: false, 
      error: 'Failed to send email. Please try again later.' 
    })
  }
})

app.listen(PORT, async () => {
  console.log(`🚀 Local API server running on http://localhost:${PORT}`)
  console.log(`📧 Contact form endpoint: http://localhost:${PORT}/api/contact`)
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth/*`)
  console.log(`📝 Blog endpoints: http://localhost:${PORT}/api/blog/*`)
  console.log(`⚙️  Admin endpoints: http://localhost:${PORT}/api/admin/*`)
  console.log('✅ Server is ready to accept requests\n')
  
  // Test database connection
  try {
    await prisma.$connect()
    const dbUrl = process.env.DATABASE_URL || ''
    const isLocal = dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1') || dbUrl.includes('5432')
    const dbType = isLocal ? 'Local Postgres' : 'Neon Postgres'
    console.log(`✅ Database connection successful (${dbType})\n`)
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    if (error.code === 'P1001') {
      console.error('   Cannot reach database server. Make sure:')
      const dbUrl = process.env.DATABASE_URL || ''
      const isLocal = dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1') || dbUrl.includes('5432')
      if (isLocal) {
        console.error('   - Local Postgres is running (try: brew services start postgresql@14)')
        console.error('   - DATABASE_URL points to correct local database')
        console.error('   - Database exists and migrations are applied (run: npm run db:push)')
      } else {
        console.error('   - Neon database is accessible')
        console.error('   - DATABASE_URL is correct')
      }
    }
    console.error('   Server will continue running, but database operations may fail\n')
  }
}).on('error', (error) => {
  console.error('❌ Server error:', error)
  if (error.code === 'EADDRINUSE') {
    console.error(`   Port ${PORT} is already in use. Please stop the other process.`)
  }
  process.exit(1)
})
