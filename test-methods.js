#!/usr/bin/env node
/**
 * Direct test of the handler methods
 */

import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '.env.local') })

// Mock request/response
function createMockReq(method, id) {
  return {
    method: method,
    url: `/api/admin/writings/${id}`,
    headers: {
      'authorization': 'Bearer fake-token-for-testing'
    },
    query: { id },
    body: method === 'PUT' ? { status: 'published' } : {}
  }
}

function createMockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    headersSent: false,
    body: null
  }
  
  res.setHeader = (key, value) => {
    res.headers[key.toLowerCase()] = value
  }
  
  res.status = (code) => {
    res.statusCode = code
    return res
  }
  
  res.json = (data) => {
    res.body = data
    res.headersSent = true
    return res
  }
  
  return res
}

async function testMethod(method, testId = 'test-id') {
  try {
    const handler = (await import('./api/admin/writings/[id].js')).default
    const req = createMockReq(method, testId)
    const res = createMockRes()
    
    console.log(`\n🧪 Testing ${method} method...`)
    console.log(`   req.method: "${req.method}" (type: ${typeof req.method})`)
    
    await handler(req, res)
    
    console.log(`   Status: ${res.statusCode}`)
    console.log(`   Response: ${JSON.stringify(res.body)}`)
    
    if (res.statusCode === 405) {
      console.log(`   ❌ Method not allowed!`)
      return false
    } else if (res.statusCode === 401) {
      console.log(`   ✅ Method check passed (auth failed as expected)`)
      return true
    } else {
      console.log(`   ✅ Method worked!`)
      return true
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`)
    return false
  }
}

async function runTests() {
  console.log('🔍 Testing method handling in writings handler...\n')
  
  const methods = ['GET', 'PUT', 'POST', 'DELETE']
  const results = {}
  
  for (const method of methods) {
    results[method] = await testMethod(method)
  }
  
  console.log('\n📊 Results:')
  for (const [method, passed] of Object.entries(results)) {
    console.log(`   ${method}: ${passed ? '✅' : '❌'}`)
  }
  
  const allPassed = Object.values(results).every(r => r)
  if (allPassed) {
    console.log('\n✅ All methods are working!')
  } else {
    console.log('\n❌ Some methods failed!')
  }
}

runTests().catch(console.error)


