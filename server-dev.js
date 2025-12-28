// Simple dev server that mimics Vercel serverless functions
// Only used for local development - production uses Vercel serverless functions
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// Load environment variables FIRST, before any other imports
// This is exactly how Vercel does it - process.env is populated automatically
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const envPath = resolve(__dirname, '.env.local')
dotenv.config({ path: envPath })

console.log('✅ Environment variables loaded')
console.log('   AUTH_USERNAME:', process.env.AUTH_USERNAME ? `"${process.env.AUTH_USERNAME}"` : 'NOT SET')
console.log('   AUTH_PASSWORD:', process.env.AUTH_PASSWORD ? 'SET' : 'NOT SET')

// Now import other modules after env vars are loaded
import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3001

// Middleware
app.use(cors())
app.use(express.json())

// Log all requests for debugging
app.use((req, res, next) => {
  console.error(`[API] 📥 ${req.method} ${req.path}`)
  next()
})

// Import and use serverless functions (after env vars are loaded)
import loginHandler from './api/auth/login.js'
import checkHandler from './api/auth/check.js'
import contactHandler from './api/contact.js'

// Route to serverless functions - handlers read directly from process.env
app.post('/api/auth/login', (req, res) => loginHandler(req, res))
app.get('/api/auth/check', (req, res) => checkHandler(req, res))
app.post('/api/contact', (req, res) => contactHandler(req, res))

app.listen(PORT, () => {
  console.log(`🚀 Local dev server running on http://localhost:${PORT}`)
  console.log(`📝 This is only for local development`)
  console.log(`🌐 Production uses Vercel serverless functions`)
  console.log(`\n🔍 Server ready - waiting for requests...`)
  console.log(`\n🔐 Auth check at startup:`)
  console.log(`   process.env.AUTH_USERNAME: ${process.env.AUTH_USERNAME || 'NOT SET'}`)
  console.log(`   process.env.AUTH_PASSWORD: ${process.env.AUTH_PASSWORD ? 'SET' : 'NOT SET'}`)
  if (!process.env.AUTH_USERNAME || !process.env.AUTH_PASSWORD) {
    console.error(`\n❌ WARNING: Auth credentials not loaded!`)
    console.error(`   Make sure .env.local exists and has AUTH_USERNAME and AUTH_PASSWORD`)
  }
})

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ UNCAUGHT EXCEPTION:', error)
  console.error('   Stack:', error.stack)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ UNHANDLED REJECTION:', reason)
  console.error('   Promise:', promise)
})

