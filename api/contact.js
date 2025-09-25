const nodemailer = require('nodemailer')

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

    // Create transporter
    const transporter = nodemailer.createTransporter({
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
Message: ${message ? message.trim() : 'No message provided'}
Timestamp: ${new Date().toISOString()}
    `.trim()

    // Send email
    await transporter.sendMail({
      from: gmailUser,
      to: gmailTo,
      subject: emailSubject,
      text: emailText
    })

    console.log(`Email sent successfully for ${email.trim()} at ${new Date().toISOString()}`)
    
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
