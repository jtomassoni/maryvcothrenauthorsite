#!/usr/bin/env node

/**
 * Quick script to fix production database from local machine
 * 
 * Usage:
 *   1. Get your DATABASE_URL from Vercel dashboard (Settings → Environment Variables)
 *   2. Run: DATABASE_URL="your-url" node scripts/fix-prod-db.js
 * 
 * Or if you have vercel CLI:
 *   vercel env pull .env.local && node scripts/fix-prod-db.js
 */

import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import dotenv from 'dotenv'
import { existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Try to load .env.local if it exists
const envPath = join(__dirname, '..', '.env.local')
if (existsSync(envPath)) {
  dotenv.config({ path: envPath })
  console.log('✅ Loaded environment from .env.local\n')
}

console.log('🔧 Fixing production database...\n')

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL is not set')
  console.error('\n📝 How to fix:')
  console.error('   Option 1: Set it as an environment variable:')
  console.error('     DATABASE_URL="your-database-url" node scripts/fix-prod-db.js')
  console.error('\n   Option 2: Use Vercel CLI to pull env vars:')
  console.error('     vercel env pull .env.local')
  console.error('     node scripts/fix-prod-db.js')
  console.error('\n   Option 3: Add DATABASE_URL to .env.local file')
  process.exit(1)
}

// Show which database we're connecting to (masked)
const dbUrl = process.env.DATABASE_URL
const isNeon = dbUrl.includes('neon.tech') || dbUrl.includes('neon')
const maskedUrl = dbUrl.length > 30 
  ? `${dbUrl.substring(0, 15)}...${dbUrl.substring(dbUrl.length - 15)}`
  : '***'

console.log(`📊 Database: ${isNeon ? 'Neon Postgres' : 'PostgreSQL'}`)
console.log(`   URL: ${maskedUrl}\n`)

try {
  console.log('📦 Step 1: Generating Prisma client...')
  execSync('npx prisma generate', {
    stdio: 'inherit',
    env: process.env,
    cwd: join(__dirname, '..')
  })

  console.log('\n🗄️  Step 2: Creating/updating database tables...')
  console.log('   This will create the blog_posts and writings tables if they don\'t exist')
  execSync('npx prisma db push --skip-generate --accept-data-loss', {
    stdio: 'inherit',
    env: process.env,
    cwd: join(__dirname, '..')
  })

  // Verify tables were created
  console.log('\n🔍 Step 3: Verifying tables exist...')
  const { PrismaClient } = await import('@prisma/client')
  const prisma = new PrismaClient()
  
  try {
    const [blogCheck, writingCheck] = await Promise.allSettled([
      prisma.blogPost.findFirst(),
      prisma.writing.findFirst()
    ])
    
    const blogError = blogCheck.status === 'rejected' && 
      (blogCheck.reason?.code === 'P2021' || blogCheck.reason?.message?.includes('does not exist'))
    const writingError = writingCheck.status === 'rejected' && 
      (writingCheck.reason?.code === 'P2021' || writingCheck.reason?.message?.includes('does not exist'))
    
    if (blogError) {
      throw new Error('blog_posts table was not created successfully')
    }
    if (writingError) {
      throw new Error('writings table was not created successfully')
    }
    
    console.log('✅ Verified: Both blog_posts and writings tables exist')
    await prisma.$disconnect()
  } catch (verifyError) {
    await prisma.$disconnect()
    throw verifyError
  }

  console.log('\n✅ SUCCESS! Your production database is now set up!')
  console.log('   The blog_posts and writings tables have been created and verified.')
  console.log('\n🎉 You can now use your admin panel in production!')
} catch (error) {
  console.error('\n❌ Error setting up database:', error.message)
  console.error('\n💡 Troubleshooting:')
  console.error('   1. Verify DATABASE_URL is correct')
  console.error('   2. Check that your database is accessible')
  console.error('   3. For Neon: Check firewall/network settings')
  console.error('   4. Make sure you have the correct connection string')
  process.exit(1)
}

