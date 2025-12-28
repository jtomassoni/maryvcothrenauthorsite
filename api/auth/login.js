import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    const { username, password } = req.body

    // Read directly from process.env
    const authUsername = process.env.AUTH_USERNAME
    const authPassword = process.env.AUTH_PASSWORD

    if (!authUsername || !authPassword) {
      return res.status(500).json({
        ok: false,
        error: 'Authentication is not configured.',
      })
    }

    // Validate credentials
    if (username !== authUsername || password !== authPassword) {
      return res.status(401).json({
        ok: false,
        error: 'Invalid username or password',
      })
    }

    // Use AUTH_SECRET for JWT signing (same as main server uses for sessions)
    const JWT_SECRET = process.env.AUTH_SECRET

    if (!JWT_SECRET) {
      console.error('Login: AUTH_SECRET not properly configured')
      return res.status(500).json({
        ok: false,
        error: 'Server configuration error. Please contact administrator.',
      })
    }

    // Generate JWT token
    const token = jwt.sign({ username: authUsername }, JWT_SECRET, {
      expiresIn: '7d',
    })

    console.log('Login: Token generated successfully for user:', authUsername)

    return res.status(200).json({
      ok: true,
      token,
      username: authUsername,
    })
  } catch (error) {
    console.error('Login error:', error)
    // Ensure we always return JSON, even on unexpected errors
    if (!res.headersSent) {
      return res.status(500).json({
        ok: false,
        error: 'Login failed. Please try again later.',
      })
    }
  }
}
