#!/usr/bin/env node
/**
 * Local testing script for API endpoints
 * Tests the actual serverless function handlers without deploying
 * 
 * Usage:
 *   node test-api-local.js
 *   node test-api-local.js --endpoint /api/admin/blog/posts/[id] --method GET --id cmjqaok0a0000i6fu9fktzsbq
 */

import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: resolve(__dirname, '.env.local') })

// Mock request/response objects for testing
function createMockReq(method = 'GET', url = '/', body = {}, query = {}, headers = {}) {
  return {
    method,
    url,
    body,
    query,
    headers: {
      'authorization': headers.authorization || headers.Authorization || '',
      ...headers
    }
  }
}

function createMockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    headersSent: false,
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
    res.setHeader('content-type', 'application/json')
    return res
  }
  
  return res
}

// Test a handler
async function testHandler(handlerPath, method = 'GET', options = {}) {
  try {
    const handler = await import(handlerPath)
    const handlerFn = handler.default
    
    const req = createMockReq(
      method,
      options.url || '/',
      options.body || {},
      options.query || {},
      options.headers || {}
    )
    
    const res = createMockRes()
    
    await handlerFn(req, res)
    
    return {
      success: res.statusCode < 400,
      status: res.statusCode,
      headers: res.headers,
      body: res.body,
      error: res.statusCode >= 400 ? res.body : null
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      stack: error.stack
    }
  }
}

// Main test function
async function runTests() {
  console.log('🧪 Testing API endpoints locally...\n')
  
  // Get auth token first (you'll need to login first)
  const testToken = process.env.TEST_AUTH_TOKEN || ''
  const testId = process.argv.find(arg => arg.startsWith('--id='))?.split('=')[1] || 'cmjqaok0a0000i6fu9fktzsbq'
  const testMethod = process.argv.find(arg => arg.startsWith('--method='))?.split('=')[1] || 'GET'
  
  const authHeaders = testToken ? { 'authorization': `Bearer ${testToken}` } : {}
  
  console.log(`📋 Test Configuration:`)
  console.log(`   Method: ${testMethod}`)
  console.log(`   ID: ${testId}`)
  console.log(`   Has Auth Token: ${!!testToken}`)
  console.log('')
  
  // Test GET /api/admin/blog/posts/[id]
  console.log('🔍 Testing GET /api/admin/blog/posts/[id]...')
  const getResult = await testHandler(
    './api/admin/blog/posts/[id].js',
    'GET',
    {
      query: { id: testId },
      headers: authHeaders
    }
  )
  console.log(`   Status: ${getResult.status}`)
  console.log(`   Success: ${getResult.success}`)
  if (getResult.body) {
    console.log(`   Response: ${JSON.stringify(getResult.body, null, 2).substring(0, 200)}...`)
  }
  if (getResult.error) {
    console.log(`   Error: ${JSON.stringify(getResult.error)}`)
  }
  console.log('')
  
  // Test DELETE /api/admin/blog/posts/[id]
  console.log('🔍 Testing DELETE /api/admin/blog/posts/[id]...')
  const deleteResult = await testHandler(
    './api/admin/blog/posts/[id].js',
    'DELETE',
    {
      query: { id: testId },
      headers: authHeaders
    }
  )
  console.log(`   Status: ${deleteResult.status}`)
  console.log(`   Success: ${deleteResult.success}`)
  if (deleteResult.body) {
    console.log(`   Response: ${JSON.stringify(deleteResult.body, null, 2)}`)
  }
  if (deleteResult.error) {
    console.log(`   Error: ${JSON.stringify(deleteResult.error)}`)
  }
  console.log('')
  
  // Test PUT /api/admin/blog/posts/[id]
  console.log('🔍 Testing PUT /api/admin/blog/posts/[id]...')
  const putResult = await testHandler(
    './api/admin/blog/posts/[id].js',
    'PUT',
    {
      query: { id: testId },
      body: { status: 'published' },
      headers: authHeaders
    }
  )
  console.log(`   Status: ${putResult.status}`)
  console.log(`   Success: ${putResult.success}`)
  if (putResult.body) {
    console.log(`   Response: ${JSON.stringify(putResult.body, null, 2).substring(0, 200)}...`)
  }
  if (putResult.error) {
    console.log(`   Error: ${JSON.stringify(putResult.error)}`)
  }
  console.log('')
  
  console.log('✅ Testing complete!')
}

// Run tests
runTests().catch(error => {
  console.error('❌ Test failed:', error)
  process.exit(1)
})

