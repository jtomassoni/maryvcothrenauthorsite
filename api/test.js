export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    console.log('Test API called with:', req.body)
    
    return res.status(200).json({ 
      ok: true, 
      message: 'Test successful',
      receivedData: req.body
    })
  } catch (error) {
    console.error('Test API error:', error)
    return res.status(500).json({ 
      ok: false, 
      error: 'Test failed: ' + error.message 
    })
  }
}
