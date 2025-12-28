#!/usr/bin/env node

/**
 * Production Helper Script
 * 
 * This script helps you run commands against your production environment locally.
 * It pulls environment variables from Vercel and sets them up for local execution.
 * 
 * Usage:
 *   node scripts/prod-helper.js <command>
 * 
 * Examples:
 *   node scripts/prod-helper.js "node scripts/fix-prod-db.js"
 *   node scripts/prod-helper.js "npx prisma studio"
 *   node scripts/prod-helper.js "npm run db:fix-prod"
 */

import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync } from 'fs'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env.local if it exists
// NOTE: .env.local is a LOCAL file that contains PRODUCTION vars downloaded from Vercel
// The command "vercel env pull .env.local" means:
//   - Pull FROM: Vercel (production)
//   - Save TO: .env.local (local file)
const envPath = join(__dirname, '..', '.env.local')
if (existsSync(envPath)) {
  dotenv.config({ path: envPath })
  console.log('✅ Loaded PRODUCTION environment variables from .env.local')
  console.log('💡 Note: .env.local contains PRODUCTION vars downloaded from Vercel\n')
} else {
  console.log('⚠️  No .env.local found.')
  console.log('📥 Downloading PRODUCTION variables FROM Vercel...')
  console.log('   (Saving them TO .env.local file)\n')
  
  // Try to pull from Vercel
  try {
    execSync('npx vercel env pull .env.local', {
      stdio: 'inherit',
      cwd: join(__dirname, '..')
    })
    dotenv.config({ path: envPath })
    console.log('\n✅ Downloaded PRODUCTION env vars FROM Vercel TO .env.local\n')
  } catch (error) {
    console.error('❌ Failed to pull from Vercel. Try:')
    console.error('   npx vercel login')
    console.error('   npx vercel link')
    console.error('   npx vercel env pull .env.local\n')
    process.exit(1)
  }
}

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL is not set')
  console.error('\n📝 How to fix:')
  console.error('   1. Run: vercel env pull .env.local')
  console.error('   2. Or set DATABASE_URL manually in .env.local')
  process.exit(1)
}

// Get the command to run
const command = process.argv.slice(2).join(' ')

if (!command) {
  console.log('📋 Production Helper')
  console.log('\nUsage: node scripts/prod-helper.js <command>')
  console.log('\nExamples:')
  console.log('  node scripts/prod-helper.js "node scripts/fix-prod-db.js"')
  console.log('  node scripts/prod-helper.js "npx prisma studio"')
  console.log('  node scripts/prod-helper.js "npx prisma db push"')
  console.log('  node scripts/prod-helper.js "npm run db:fix-prod"')
  console.log('\n💡 This script uses your production DATABASE_URL from Vercel')
  process.exit(0)
}

// Show which database we're connecting to (masked)
const dbUrl = process.env.DATABASE_URL
const isNeon = dbUrl.includes('neon.tech') || dbUrl.includes('neon')
const maskedUrl = dbUrl.length > 30 
  ? `${dbUrl.substring(0, 15)}...${dbUrl.substring(dbUrl.length - 15)}`
  : '***'

console.log('🔧 Running command against PRODUCTION environment')
console.log(`📊 Database: ${isNeon ? 'Neon Postgres' : 'PostgreSQL'}`)
console.log(`   URL: ${maskedUrl}`)
console.log(`\n▶️  Command: ${command}\n`)

// Run the command with production environment variables
try {
  execSync(command, {
    stdio: 'inherit',
    env: process.env,
    cwd: join(__dirname, '..')
  })
} catch (error) {
  console.error('\n❌ Command failed')
  process.exit(1)
}

