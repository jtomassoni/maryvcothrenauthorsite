#!/usr/bin/env node
/**
 * Local server that runs Vercel serverless functions for testing
 * This mimics how Vercel runs the functions in production
 *
 * Usage:
 *   node test-serverless-local.js
 *   Then test with: curl http://localhost:3002/api/admin/writings/cmjqaok0a0000i6fu9fktzsbq
 */

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: resolve(__dirname, '.env.local') })

const app = express()
const PORT = 3002

app.use(cors())
app.use(express.json())

// Convert Express req/res to Vercel format
function convertToVercelFormat(expressReq, expressRes) {
  // Merge params into query (Vercel does this automatically)
  const query = { ...expressReq.query, ...expressReq.params }

  const vercelReq = {
    method: expressReq.method,
    url: expressReq.url,
    headers: expressReq.headers,
    query: query,
    body: expressReq.body,
  }

  console.log(`[test-server] ${vercelReq.method} ${vercelReq.url}`)
  console.log(`[test-server] Query:`, query)

  const vercelRes = {
    statusCode: 200,
    headers: {},
    headersSent: false,

    setHeader(key, value) {
      this.headers[key.toLowerCase()] = value
      expressRes.setHeader(key, value)
    },

    status(code) {
      this.statusCode = code
      return this
    },

    json(data) {
      if (!this.headersSent) {
        this.headersSent = true
        expressRes.status(this.statusCode).json(data)
      }
      return this
    },

    send(data) {
      if (!this.headersSent) {
        this.headersSent = true
        expressRes.status(this.statusCode).send(data)
      }
      return this
    },

    end(data) {
      if (!this.headersSent) {
        this.headersSent = true
        expressRes.status(this.statusCode).end(data)
      }
      return this
    },
  }

  return { req: vercelReq, res: vercelRes }
}

// Load and route serverless functions
async function loadServerlessFunction(path) {
  try {
    const module = await import(path)
    return module.default
  } catch (error) {
    console.error(`Failed to load ${path}:`, error.message)
    return null
  }
}

app.all('/api/admin/writings/:id', async (req, res) => {
  try {
    const { req: vercelReq, res: vercelRes } = convertToVercelFormat(req, res)
    vercelReq.query.id = req.params.id

    const handler = await loadServerlessFunction('./api/admin/writings/[id].js')
    if (handler) {
      await handler(vercelReq, vercelRes)
    } else {
      res.status(500).json({ ok: false, error: 'Handler not found' })
    }
  } catch (error) {
    console.error('Error in /api/admin/writings/:id:', error)
    res.status(500).json({ ok: false, error: error.message })
  }
})

// Route handler for dynamic [slug] routes
app.all('/api/writings/:slug', async (req, res) => {
  try {
    const { req: vercelReq, res: vercelRes } = convertToVercelFormat(req, res)
    vercelReq.query.slug = req.params.slug

    const handler = await loadServerlessFunction('./api/writings/[slug].js')
    if (handler) {
      await handler(vercelReq, vercelRes)
    } else {
      res.status(500).json({ ok: false, error: 'Handler not found' })
    }
  } catch (error) {
    console.error('Error in /api/writings/:slug:', error)
    res.status(500).json({ ok: false, error: error.message })
  }
})

// Route handler for static routes
const staticRoutes = [
  { path: '/api/admin/writings', file: './api/admin/writings.js' },
  { path: '/api/writings', file: './api/writings.js' },
  { path: '/api/latest', file: './api/latest.js' },
  { path: '/api/auth/login', file: './api/auth/login.js' },
  { path: '/api/auth/check', file: './api/auth/check.js' },
  { path: '/api/contact', file: './api/contact.js' },
]

for (const route of staticRoutes) {
  app.all(route.path, async (req, res) => {
    const { req: vercelReq, res: vercelRes } = convertToVercelFormat(req, res)

    const handler = await loadServerlessFunction(route.file)
    if (handler) {
      await handler(vercelReq, vercelRes)
    } else {
      res.status(500).json({ ok: false, error: 'Handler not found' })
    }
  })
}

app.listen(PORT, () => {
  console.log('🧪 Test server running on http://localhost:' + PORT)
  console.log('📝 This runs your Vercel serverless functions locally')
  console.log('')
  console.log('Test endpoints:')
  console.log(`  GET  http://localhost:${PORT}/api/admin/writings/:id`)
  console.log(`  PUT  http://localhost:${PORT}/api/admin/writings/:id`)
  console.log(`  DELETE http://localhost:${PORT}/api/admin/writings/:id`)
  console.log('')
  console.log('Example:')
  console.log(
    `  curl -X GET http://localhost:${PORT}/api/admin/writings/cmjqaok0a0000i6fu9fktzsbq \\`
  )
  console.log(`    -H "Authorization: Bearer YOUR_TOKEN"`)
  console.log('')
})
