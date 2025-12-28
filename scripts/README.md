# Production Helper Scripts

These scripts help you work with your production environment from your local machine.

## Quick Start

### 1. Pull Production Environment Variables

```bash
npm run prod:env
```

This pulls all environment variables from Vercel into `.env.local`.

### 2. Run Commands Against Production

Use the `prod` helper to run any command with production environment variables:

```bash
# Fix production database
npm run prod "node scripts/fix-prod-db.js"

# Or use the shorthand
npm run prod "npm run db:fix-prod"

# Run Prisma Studio against production (GUI database browser)
npm run prod "npx prisma studio"

# Push schema changes to production
npm run prod "npx prisma db push"

# Generate Prisma client
npm run prod "npx prisma generate"

# Check database tables
npm run prod "node -e \"import('@prisma/client').then(({PrismaClient})=>{const p=new PrismaClient();p.writing.findFirst().then(()=>console.log('✅ Writings table works')).catch(e=>console.error('❌',e.message)).finally(()=>p.\$disconnect())\""
```

## Common Tasks

### Fix Production Database Tables

```bash
npm run prod:env
npm run prod "npm run db:fix-prod"
```

### Debug Production Database

```bash
# Pull env vars
npm run prod:env

# Open Prisma Studio (GUI)
npm run prod "npx prisma studio"
# Then visit http://localhost:5555
```

### Test Production API Locally

```bash
# Pull env vars
npm run prod:env

# Start dev server (will use production DATABASE_URL)
npm run dev
```

## Important Notes

⚠️ **Warning**: These commands connect to your PRODUCTION database. Be careful!

- Always test locally first
- Make backups before destructive operations
- Double-check you're using the right environment

## Troubleshooting

### "DATABASE_URL is not set"

```bash
# Pull environment variables from Vercel
npm run prod:env

# Or manually set in .env.local
echo 'DATABASE_URL="your-production-url"' >> .env.local
```

### "Vercel CLI not found"

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to your project
vercel link
```

