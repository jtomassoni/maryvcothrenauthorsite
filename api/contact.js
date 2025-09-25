const { Resend } = require('resend')

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

    // Hardcoded environment variables for now
    const resendApiKey = process.env.RESEND_API_KEY || 're_1234567890abcdef' // Replace with your actual key
    const recipientEmail = process.env.GMAIL_TO || 'maryvcothren@gmail.com'

    // Initialize Resend
    const resend = new Resend(resendApiKey)

    // Send email using Resend
    console.log('Attempting to send email with Resend...')
    console.log('API Key (first 10 chars):', resendApiKey.substring(0, 10))
    console.log('Recipient:', recipientEmail)
    
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
    
    if (!emailData || !emailData.id) {
      throw new Error('Resend did not return a valid response')
    }
    
    return res.status(200).json({ 
      ok: true, 
      message: 'Thank you for subscribing! You\'ll hear from me soon.'
    })

  } catch (error) {
    console.error('Contact API error:', error)
    return res.status(500).json({ 
      ok: false, 
      error: 'Failed to send email. Please try again later.' 
    })
  }
}
