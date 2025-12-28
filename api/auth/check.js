import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    // Get token from Authorization header (Vercel may lowercase headers)
    const authHeader = req.headers.authorization || req.headers.Authorization
    if (!authHeader) {
      console.error('Auth check: No authorization header found')
      console.error('Available headers:', Object.keys(req.headers))
      return res.status(401).json({
        ok: false,
        authenticated: false,
        error: 'No token provided',
      })
    }

    if (
      !authHeader.startsWith('Bearer ') &&
      !authHeader.startsWith('bearer ')
    ) {
      console.error(
        'Auth check: Invalid authorization header format:',
        authHeader.substring(0, 20)
      )
      return res.status(401).json({
        ok: false,
        authenticated: false,
        error: 'Invalid authorization format',
      })
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' or 'bearer ' prefix

    // Use AUTH_SECRET for JWT verification (same as login.js uses for signing)
    const JWT_SECRET = process.env.AUTH_SECRET

    if (!JWT_SECRET) {
      console.error('Auth check: AUTH_SECRET not properly configured')
      return res.status(500).json({
        ok: false,
        authenticated: false,
        error: 'Server configuration error',
      })
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      console.log(
        'Auth check: Token verified successfully for user:',
        decoded.username
      )

      return res.status(200).json({
        ok: true,
        authenticated: true,
        username: decoded.username,
      })
    } catch (jwtError) {
      // Token is invalid or expired
      console.error('Auth check: JWT verification failed:', jwtError.message)
      console.error('Token (first 20 chars):', token.substring(0, 20))
      return res.status(401).json({
        ok: false,
        authenticated: false,
        error: 'Invalid or expired token',
      })
    }
  } catch (error) {
    console.error('Auth check error:', error)
    // Ensure we always return JSON, even on unexpected errors
    if (!res.headersSent) {
      return res.status(500).json({
        ok: false,
        authenticated: false,
        error: 'Authentication check failed',
      })
    }
  }
}
