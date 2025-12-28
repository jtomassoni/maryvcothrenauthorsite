import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        ok: false, 
        authenticated: false,
        error: 'No token provided' 
      })
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    // Get JWT secret (should match login.js)
    const JWT_SECRET = process.env.JWT_SECRET || process.env.AUTH_SECRET || 'your-secret-key-change-in-production'

    // Verify token
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      
      return res.status(200).json({ 
        ok: true, 
        authenticated: true,
        username: decoded.username
      })
    } catch (jwtError) {
      // Token is invalid or expired
      return res.status(401).json({ 
        ok: false, 
        authenticated: false,
        error: 'Invalid or expired token' 
      })
    }

  } catch (error) {
    console.error('Auth check error:', error)
    // Ensure we always return JSON, even on unexpected errors
    if (!res.headersSent) {
      return res.status(500).json({ 
        ok: false, 
        authenticated: false,
        error: 'Authentication check failed' 
      })
    }
  }
}

