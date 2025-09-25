export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    console.log('Contact API called with:', req.body)
    
    // Basic validation
    const { name, email, message } = req.body
    
    if (!name || !email) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Name and email are required' 
      })
    }

    // Check environment variables
    const gmailTo = process.env.GMAIL_TO
    const gmailUser = process.env.GMAIL_USER
    const gmailPass = process.env.GMAIL_PASS

    if (!gmailTo || !gmailUser || !gmailPass) {
      console.warn('Missing email configuration')
      return res.status(500).json({ 
        ok: false, 
        error: 'Email service is not configured' 
      })
    }

    // For now, just return success without sending email
    // This will help us isolate if the issue is with nodemailer
    console.log('Would send email to:', gmailTo, 'from:', name, email)
    
    return res.status(200).json({ 
      ok: true, 
      message: 'Contact form received successfully (email sending disabled for testing)'
    })

  } catch (error) {
    console.error('Contact API error:', error)
    return res.status(500).json({ 
      ok: false, 
      error: 'Server error: ' + error.message 
    })
  }
}
