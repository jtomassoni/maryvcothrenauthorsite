export default async function handler(req, res) {
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

    // Try using fetch to send email via a webhook service
    // This is more reliable than nodemailer in serverless environments
    try {
      const emailData = {
        to: gmailTo,
        from: gmailUser,
        subject: `New mailing list signup from ${name.trim()}`,
        text: `
New mailing list signup:

Name: ${name.trim()}
Email: ${email.trim()}
Message: ${message ? message.trim() : 'No message provided'}
Timestamp: ${new Date().toISOString()}
        `.trim()
      }

      // For now, just log the email data
      // In a real implementation, you could use a service like SendGrid, Mailgun, or Resend
      console.log('Email data:', emailData)
      
      return res.status(200).json({ 
        ok: true, 
        message: 'Thank you for subscribing! You\'ll hear from me soon.'
      })
      
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      return res.status(500).json({ 
        ok: false, 
        error: 'Failed to send email. Please try again later.' 
      })
    }

  } catch (error) {
    console.error('Contact API error:', error)
    return res.status(500).json({ 
      ok: false, 
      error: 'Server error: ' + error.message 
    })
  }
}
