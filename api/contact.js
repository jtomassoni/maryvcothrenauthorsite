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

    // Resend API configuration
    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      console.error('❌ RESEND_API_KEY not set in environment variables')
      return res.status(500).json({ 
        ok: false, 
        error: 'Email service not configured. Please contact the administrator.' 
      })
    }
    const recipientEmail = 'maryvcothren@gmail.com'
    
    // Use verified domain email if set, otherwise use Resend's test domain
    // For development: use onboarding@resend.dev (no verification needed)
    // For production: verify your domain at https://resend.com/domains and use your domain email
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
    const fromName = process.env.RESEND_FROM_NAME || 'Mary V Cothren'

    console.log('Attempting to send email with Resend API...')
    console.log('API Key (first 10 chars):', resendApiKey.substring(0, 10))
    console.log('From:', fromEmail)
    console.log('Recipient:', recipientEmail)
    
    // Use direct fetch to Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
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
    })

    console.log('Resend API response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Resend API error:', errorText)
      throw new Error(`Resend API error: ${response.status} - ${errorText}`)
    }

    const emailData = await response.json()
    console.log('Email sent successfully:', emailData)
    
    return res.status(200).json({ 
      ok: true, 
      message: 'Thank you for subscribing! You\'ll hear from me soon.'
    })

  } catch (error) {
    console.error('Contact API error:', error)
    return res.status(500).json({ 
      ok: false, 
      error: 'Failed to send email: ' + error.message 
    })
  }
}
