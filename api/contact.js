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
    const resendApiKey = process.env.RESEND_API_KEY
    const recipientEmail = process.env.GMAIL_TO

    console.log('Environment check:', {
      hasResendKey: !!resendApiKey,
      hasRecipientEmail: !!recipientEmail,
      recipientEmail: recipientEmail
    })

    if (!resendApiKey || !recipientEmail) {
      console.warn('Missing email configuration')
      return res.status(500).json({ 
        ok: false, 
        error: 'Email service is not configured' 
      })
    }

    // Try to import Resend dynamically to avoid module issues
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(resendApiKey)

      const emailData = await resend.emails.send({
        from: 'Mary\'s Website <noreply@maryvcothren.com>',
        to: [recipientEmail],
        subject: `New mailing list signup from ${name.trim()}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1e293b;">New Mailing List Signup</h2>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Name:</strong> ${name.trim()}</p>
              <p><strong>Email:</strong> ${email.trim()}</p>
              <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            </div>
          </div>
        `
      })

      console.log('Email sent successfully:', emailData)
      
      return res.status(200).json({ 
        ok: true, 
        message: 'Thank you for subscribing! You\'ll hear from me soon.'
      })
      
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      return res.status(500).json({ 
        ok: false, 
        error: 'Failed to send email: ' + emailError.message 
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
