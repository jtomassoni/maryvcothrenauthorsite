#!/usr/bin/env node

/**
 * Vercel Migration Script
 * 
 * This script runs database migrations for Vercel deployments.
 * It can be run:
 * 1. During Vercel build (automatically)
 * 2. Manually via Vercel CLI: vercel env pull && node scripts/vercel-migrate.js
 * 3. Locally with DATABASE_URL set: DATABASE_URL=... node scripts/vercel-migrate.js
 */

import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('🚀 Running database migrations for Vercel...\n')

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL environment variable is not set')
  console.error('   For Vercel: Make sure DATABASE_URL is set in your Vercel project settings')
  console.error('   For local: Set DATABASE_URL in your environment or .env file')
  process.exit(1)
}

// Mask the database URL for logging (show only first and last few chars)
const dbUrl = process.env.DATABASE_URL
const maskedUrl = dbUrl.length > 20 
  ? `${dbUrl.substring(0, 10)}...${dbUrl.substring(dbUrl.length - 10)}`
  : '***'
console.log(`📊 Database: ${maskedUrl}\n`)

try {
  console.log('📦 Step 1: Generating Prisma client...')
  execSync('npx prisma generate', {
    stdio: 'inherit',
    env: process.env,
    cwd: join(__dirname, '..')
  })

  console.log('\n🗄️  Step 2: Pushing schema to database...')
  console.log('   (This creates/updates tables based on your Prisma schema)')
  execSync('npx prisma db push --skip-generate --accept-data-loss', {
    stdio: 'inherit',
    env: process.env,
    cwd: join(__dirname, '..')
  })

  console.log('\n✅ Database migration complete!')
  console.log('   Your database tables are now up to date.')
} catch (error) {
  console.error('\n❌ Error running migrations:', error.message)
  console.error('\n⚠️  WARNING: Database migration failed!')
  console.error('   The build will continue, but your database tables may not exist.')
  console.error('   You may need to run migrations manually after deployment.')
  console.error('\n💡 Troubleshooting:')
  console.error('   1. Verify DATABASE_URL is correct in Vercel project settings')
  console.error('   2. Check that your database is accessible from Vercel')
  console.error('   3. Ensure your database allows connections from Vercel IPs')
  console.error('   4. For Neon/other cloud DBs, check firewall/network settings')
  console.error('   5. Run manually: vercel env pull && node scripts/vercel-migrate.js')
  
  // During Vercel build, we should fail the build if migrations fail
  // This ensures the database is set up before deployment
  const isVercelBuild = process.env.VERCEL === '1'
  if (isVercelBuild) {
    console.error('\n❌ Build failed: Database migrations must succeed before deployment')
    console.error('   Please check your DATABASE_URL in Vercel project settings')
    process.exit(1)
  } else {
    // In manual execution, exit with error
    process.exit(1)
  }
}

