import { createHmac, timingSafeEqual } from 'crypto'

const AUTH_SECRET = process.env.AUTH_SECRET
const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || 'mvc_auth'
const AUTH_SESSION_DAYS = parseInt(process.env.AUTH_SESSION_DAYS || '7', 10)

// Warn in dev if AUTH_SECRET is missing, but allow a fallback
let secret = AUTH_SECRET
if (!secret) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'AUTH_SECRET environment variable is required in production'
    )
  }
  console.warn(
    '⚠️  WARNING: AUTH_SECRET not set. Using temporary fallback. Set AUTH_SECRET in production!'
  )
  secret = 'temporary-dev-secret-change-in-production'
}

/**
 * Sign a session payload
 */
export function signSession(payload) {
  const data = JSON.stringify(payload)
  const signature = createHmac('sha256', secret)
    .update(data)
    .digest('base64url')

  const encoded = Buffer.from(data).toString('base64url')
  return `${encoded}.${signature}`
}

/**
 * Verify and decode a session token
 */
export function verifySession(token) {
  try {
    const [encoded, signature] = token.split('.')
    if (!encoded || !signature) {
      return null
    }

    const data = Buffer.from(encoded, 'base64url').toString('utf-8')
    const expectedSignature = createHmac('sha256', secret)
      .update(data)
      .digest('base64url')

    // Use timing-safe comparison
    const provided = Buffer.from(signature, 'base64url')
    const expected = Buffer.from(expectedSignature, 'base64url')

    if (provided.length !== expected.length) {
      return null
    }

    if (!timingSafeEqual(provided, expected)) {
      return null
    }

    const payload = JSON.parse(data)

    // Check expiration
    if (payload.exp && payload.exp < Date.now()) {
      return null
    }

    return payload
  } catch (error) {
    return null
  }
}

/**
 * Create a session token for a user
 */
export function createSession(username) {
  const now = Date.now()
  const expiresAt = now + AUTH_SESSION_DAYS * 24 * 60 * 60 * 1000

  return signSession({
    u: username,
    iat: now,
    exp: expiresAt,
  })
}

/**
 * Set auth cookie on response
 */
export function setAuthCookie(res, token) {
  const maxAge = AUTH_SESSION_DAYS * 24 * 60 * 60 * 1000
  res.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge,
    path: '/',
  })
}

/**
 * Clear auth cookie
 */
export function clearAuthCookie(res) {
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
}

/**
 * Get session from request
 */
export function getSession(req) {
  const token = req.cookies?.[AUTH_COOKIE_NAME]
  if (!token) {
    return null
  }
  return verifySession(token)
}

/**
 * Check if user is authenticated
 */
export function requireAuth(req, res, next) {
  const session = getSession(req)
  if (!session || !session.u) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' })
  }
  req.user = session.u
  next()
}

export { AUTH_COOKIE_NAME, AUTH_SESSION_DAYS }
