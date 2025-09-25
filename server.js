import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const app = express()
const PORT = 3001

// Middleware
app.use(cors())
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

    // Check environment variables
    const gmailTo = process.env.GMAIL_TO
    const gmailUser = process.env.GMAIL_USER
    const gmailPass = process.env.GMAIL_PASS

    if (!gmailTo || !gmailUser || !gmailPass) {
      console.warn('Missing email configuration. Please set GMAIL_TO, GMAIL_USER, and GMAIL_PASS environment variables.')
      return res.status(500).json({ 
        ok: false, 
        error: 'Email service is not configured. Please try again later.' 
      })
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass
      }
    })

    // Prepare email content
    const emailSubject = `New mailing list signup from ${name.trim()}`
    const emailText = `
New mailing list signup:

Name: ${name.trim()}
Email: ${email.trim()}
Timestamp: ${new Date().toISOString()}
    `.trim()

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e293b;">New Mailing List Signup</h2>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${name.trim()}</p>
          <p><strong>Email:</strong> ${email.trim()}</p>
          <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `

    // Send email
    await transporter.sendMail({
      from: gmailUser,
      to: gmailTo,
      subject: emailSubject,
      text: emailText,
      html: emailHtml
    })

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

app.listen(PORT, () => {
  console.log(`🚀 Local API server running on http://localhost:${PORT}`)
  console.log(`📧 Contact form endpoint: http://localhost:${PORT}/api/contact`)
})
