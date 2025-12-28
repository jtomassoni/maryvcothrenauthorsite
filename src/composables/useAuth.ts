import { ref, computed } from 'vue'

const token = ref<string | null>(localStorage.getItem('auth_token'))
const username = ref<string | null>(localStorage.getItem('auth_username'))

const isAuthenticated = computed(() => !!token.value)

// In production, use relative paths (Vercel serverless functions)
// In dev, Vite proxies to localhost:3001
const API_BASE_URL = import.meta.env.VITE_API_URL || ''

async function login(userUsername: string, password: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: userUsername, password }),
    })

    const data = await response.json()

    if (data.ok && data.token) {
      token.value = data.token
      username.value = data.username
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('auth_username', data.username)
      return { ok: true }
    } else {
      return { ok: false, error: data.error || 'Login failed' }
    }
  } catch (error) {
    console.error('Login error:', error)
    return { ok: false, error: 'Network error. Please try again.' }
  }
}

async function checkAuth(): Promise<boolean> {
  if (!token.value) {
    return false
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/check`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token.value}`,
      },
    })

    const data = await response.json()

    if (data.ok && data.authenticated) {
      return true
    } else {
      // Token is invalid, clear it
      logout()
      return false
    }
  } catch (error) {
    console.error('Auth check error:', error)
    // On network error, assume token is still valid (don't log out)
    return true
  }
}

function logout() {
  token.value = null
  username.value = null
  localStorage.removeItem('auth_token')
  localStorage.removeItem('auth_username')
}

export function useAuth() {
  return {
    token,
    username,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  }
}

