#!/usr/bin/env node

/**
 * Production database setup script
 * This script pushes the Prisma schema to the production database
 * Run this manually if the build process doesn't create the tables
 * 
 * Usage: node scripts/db-setup-prod.js
 * 
 * Note: This uses DATABASE_URL from environment variables
 */

import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('🚀 Setting up production database...\n')

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL environment variable is not set')
  console.error('   Please set DATABASE_URL before running this script')
  process.exit(1)
}

try {
  console.log('📦 Generating Prisma client...')
  execSync('npx prisma generate', {
    stdio: 'inherit',
    env: process.env,
    cwd: join(__dirname, '..')
  })

  console.log('\n🗄️  Pushing schema to database...')
  execSync('npx prisma db push --skip-generate --accept-data-loss', {
    stdio: 'inherit',
    env: process.env,
    cwd: join(__dirname, '..')
  })

  console.log('\n✅ Database setup complete!')
} catch (error) {
  console.error('\n❌ Error setting up database:', error.message)
  process.exit(1)
}

