#!/usr/bin/env node

/**
 * Quick script to check if environment variables are loaded correctly
 * Run with: node check-env.js
 */

import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
const envResult = dotenv.config({ path: join(__dirname, '.env.local') })

console.log('🔍 Environment Variable Check\n')

if (envResult.error) {
  console.error('❌ Error loading .env.local:', envResult.error.message)
  console.error('\n   Make sure .env.local exists in the project root')
  process.exit(1)
} else {
  console.log('✅ Successfully loaded .env.local\n')
}

console.log('📋 Required Variables:')
const dbUrl = process.env.DATABASE_URL || ''
const isLocal =
  dbUrl.includes('localhost') ||
  dbUrl.includes('127.0.0.1') ||
  dbUrl.includes('5432')
const isNeon = dbUrl.includes('neon.tech') || dbUrl.includes('neon')

if (dbUrl) {
  if (isLocal) {
    console.log('   DATABASE_URL: ✅ Set (Local Postgres)')
  } else if (isNeon) {
    console.log('   DATABASE_URL: ✅ Set (Neon Postgres)')
  } else {
    console.log('   DATABASE_URL: ✅ Set (Custom)')
  }
} else {
  console.log('   DATABASE_URL: ❌ NOT SET')
}

console.log(
  '   AUTH_USERNAME:',
  process.env.AUTH_USERNAME
    ? `✅ Set (${process.env.AUTH_USERNAME.length} chars)`
    : '❌ NOT SET'
)
console.log(
  '   AUTH_PASSWORD:',
  process.env.AUTH_PASSWORD
    ? `✅ Set (${process.env.AUTH_PASSWORD.length} chars)`
    : '❌ NOT SET'
)
console.log(
  '   AUTH_SECRET:',
  process.env.AUTH_SECRET ? `✅ Set` : '⚠️  NOT SET (using fallback in dev)'
)

console.log('\n📧 Email Service Configuration:')
console.log(
  '   RESEND_API_KEY:',
  process.env.RESEND_API_KEY
    ? `✅ Set (${process.env.RESEND_API_KEY.length} chars)`
    : '❌ NOT SET'
)
console.log('\n')
