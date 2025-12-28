#!/usr/bin/env node

import dotenv from 'dotenv'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env.local
const envResult = dotenv.config({ path: join(__dirname, '..', '.env.local') })

if (envResult.error) {
  console.error('❌ Error loading .env.local:', envResult.error.message)
  process.exit(1)
}

// Run prisma db push with the loaded environment
try {
  execSync('npx prisma db push', {
    stdio: 'inherit',
    env: process.env,
    cwd: join(__dirname, '..'),
  })
} catch (error) {
  process.exit(1)
}
