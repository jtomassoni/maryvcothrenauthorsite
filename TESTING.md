# Local Testing Guide

Test your Vercel serverless functions locally before deploying.

## Quick Start

1. **Start the test server:**
   ```bash
   npm run test:api
   ```
   This starts a server on `http://localhost:3002` that runs your actual serverless functions.

2. **Get an auth token:**
   - Start your regular dev server: `npm run dev`
   - Login at `http://localhost:3000/login`
   - Open browser console and run: `localStorage.getItem('auth_token')`
   - Copy the token

3. **Test endpoints:**
   ```bash
   # Test GET (replace TOKEN and ID)
   curl -X GET http://localhost:3002/api/admin/blog/posts/cmjqaok0a0000i6fu9fktzsbq \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json"

   # Test DELETE
   curl -X DELETE http://localhost:3002/api/admin/blog/posts/cmjqaok0a0000i6fu9fktzsbq \
     -H "Authorization: Bearer YOUR_TOKEN"

   # Test PUT (toggle status)
   curl -X PUT http://localhost:3002/api/admin/blog/posts/cmjqaok0a0000i6fu9fktzsbq \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"status":"published"}'
   ```

## Testing in Browser

1. Start test server: `npm run test:api` (port 3002)
2. Start frontend: `npm run dev:frontend` (port 3000)
3. Update `vite.config.ts` to proxy to port 3002 instead of 3001
4. Test in browser - all API calls will hit your serverless functions

## What This Tests

- ✅ Actual serverless function handlers (same code as production)
- ✅ Method handling (GET, PUT, POST, DELETE)
- ✅ Authentication
- ✅ Database queries
- ✅ Error handling

## Troubleshooting

**"Handler not found"**
- Make sure the file path is correct
- Check that the file exports `export default async function handler`

**"Unauthorized"**
- Make sure you have a valid auth token
- Check that AUTH_SECRET is set in .env.local

**Database errors**
- Make sure DATABASE_URL is set in .env.local
- Run `npm run db:push` to ensure tables exist


