import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { prisma } from './lib/db.js'

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
  console.warn(
    '⚠️  Warning: Could not load .env.local file:',
    envResult.error.message
  )
  console.warn('   Make sure .env.local exists in the project root')
} else {
  console.log('✅ Loaded environment variables from .env.local')
}

// Log database configuration
console.log('\n📊 Database Configuration:')
const dbUrl = process.env.DATABASE_URL || ''
if (dbUrl) {
  const isLocal =
    dbUrl.includes('localhost') ||
    dbUrl.includes('127.0.0.1') ||
    dbUrl.includes('5432')
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
console.log(
  '   RESEND_API_KEY:',
  process.env.RESEND_API_KEY
    ? `✅ Set (${process.env.RESEND_API_KEY.length} chars)`
    : '❌ NOT SET'
)
const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
const fromName = process.env.RESEND_FROM_NAME || 'Mary V Cothren'
console.log('   RESEND_FROM_EMAIL:', fromEmail)
console.log('   RESEND_FROM_NAME:', fromName)
if (!process.env.RESEND_FROM_EMAIL) {
  console.log(
    '   ℹ️  Using test domain (onboarding@resend.dev) - set RESEND_FROM_EMAIL to use your verified domain'
  )
}
console.log('')

const app = express()
const PORT = 3001

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? 'https://www.maryvcothren.com'
        : 'http://localhost:3000',
    credentials: true,
  })
)
app.use(express.json())

// Simple in-memory rate limiting
const rateLimitMap = new Map()

const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 5

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

function validateInput(data) {
  const errors = []

  if (
    !data.name ||
    typeof data.name !== 'string' ||
    data.name.trim().length < 2
  ) {
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

  if (
    data.message &&
    typeof data.message === 'string' &&
    data.message.length > 1000
  ) {
    errors.push('Message must be less than 1000 characters')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true, status: 'healthy' })
})

// ============================================================================
// PUBLIC WRITING ENDPOINTS
// ============================================================================

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
          contentMarkdown: true,
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

// GET /api/latest - Latest writings
app.get('/api/latest', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || '3', 10)

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
      take: limit,
    })

    return res.status(200).json({
      ok: true,
      items: writings.map((item) => ({ ...item, type: 'writing' })),
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
// CONTACT FORM ENDPOINT
// ============================================================================

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown'

    if (!checkRateLimit(clientIP)) {
      return res.status(429).json({
        ok: false,
        error: 'Too many requests. Please try again later.',
      })
    }

    const { name, email, message } = req.body

    const validation = validateInput({ name, email, message })
    if (!validation.isValid) {
      return res.status(400).json({
        ok: false,
        error: validation.errors.join(', '),
      })
    }

    // Use Resend API
    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      console.error('❌ RESEND_API_KEY not set in environment variables')
      return res.status(500).json({
        ok: false,
        error:
          'Email service not configured. Please contact the administrator.',
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
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: [recipientEmail],
        subject: subject,
        html: emailHtml,
      }),
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
            console.error(
              '   💡 Tip: Make sure your domain is verified at https://resend.com/domains'
            )
            console.error(
              '   💡 Or use onboarding@resend.dev for testing (set RESEND_FROM_EMAIL=onboarding@resend.dev)'
            )
          }
        }
      } catch (e) {
        // If error text is not JSON, use it as-is
        errorMessage = errorText
      }

      throw new Error(`Resend API error: ${response.status} - ${errorMessage}`)
    }

    const emailData = await response.json()
    console.log(
      `Email sent successfully for ${email.trim()} at ${new Date().toISOString()}`
    )

    return res.status(200).json({ ok: true })
  } catch (error) {
    console.error('Email sending error:', error)
    return res.status(500).json({
      ok: false,
      error: 'Failed to send email. Please try again later.',
    })
  }
})

app
  .listen(PORT, async () => {
    console.log(`🚀 Local API server running on http://localhost:${PORT}`)
    console.log(
      `📧 Contact form endpoint: http://localhost:${PORT}/api/contact`
    )
    console.log(`📝 Writing endpoints: http://localhost:${PORT}/api/writings*`)
    console.log('✅ Server is ready to accept requests\n')

    // Test database connection
    try {
      await prisma.$connect()
      const dbUrl = process.env.DATABASE_URL || ''
      const isLocal =
        dbUrl.includes('localhost') ||
        dbUrl.includes('127.0.0.1') ||
        dbUrl.includes('5432')
      const dbType = isLocal ? 'Local Postgres' : 'Neon Postgres'
      console.log(`✅ Database connection successful (${dbType})\n`)
    } catch (error) {
      console.error('❌ Database connection failed:', error.message)
      if (error.code === 'P1001') {
        console.error('   Cannot reach database server. Make sure:')
        const dbUrl = process.env.DATABASE_URL || ''
        const isLocal =
          dbUrl.includes('localhost') ||
          dbUrl.includes('127.0.0.1') ||
          dbUrl.includes('5432')
        if (isLocal) {
          console.error(
            '   - Local Postgres is running (try: brew services start postgresql@14)'
          )
          console.error('   - DATABASE_URL points to correct local database')
          console.error(
            '   - Database exists and migrations are applied (run: npm run db:push)'
          )
        } else {
          console.error('   - Neon database is accessible')
          console.error('   - DATABASE_URL is correct')
        }
      }
      console.error(
        '   Server will continue running, but database operations may fail\n'
      )
    }
  })
  .on('error', (error) => {
    console.error('❌ Server error:', error)
    if (error.code === 'EADDRINUSE') {
      console.error(
        `   Port ${PORT} is already in use. Please stop the other process.`
      )
    }
    process.exit(1)
  })
