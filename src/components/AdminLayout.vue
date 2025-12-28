<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-950">
    <Container>
      <div class="py-4">
        <!-- Loading state - show nothing admin-related -->
        <div v-if="checkingAuth" class="flex items-center justify-center min-h-[60vh]">
          <div class="text-center">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800 dark:border-blue-400 mb-4"></div>
            <p class="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>

        <!-- Not authenticated - show nothing admin-related -->
        <div v-else-if="!authenticated" class="flex items-center justify-center min-h-[60vh]">
          <div class="text-center">
            <p class="text-gray-600 dark:text-slate-300 mb-4">Access denied. Redirecting to login...</p>
          </div>
        </div>

        <!-- Authenticated content - only show when authenticated -->
        <template v-else>
          <!-- Admin Header -->
          <div class="mb-4 flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-slate-100">
                {{ title }}
              </h1>
              <p v-if="subtitle" class="mt-0.5 text-xs text-gray-600 dark:text-slate-300">
                {{ subtitle }}
              </p>
            </div>
          </div>

          <!-- Admin content slot -->
          <slot />
        </template>
      </div>
    </Container>
    
    <!-- Debug Log Viewer -->
    <DebugLogViewer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Container from './Container.vue'
import DebugLogViewer from './DebugLogViewer.vue'

defineProps<{
  title: string
  subtitle?: string
}>()

const router = useRouter()

const authenticated = ref(false)
const checkingAuth = ref(true)

const checkAuth = async () => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('auth_token')
    
    if (!token) {
      // No token, redirect to login
      authenticated.value = false
      checkingAuth.value = false
      router.push('/login')
      return
    }
    
    const response = await fetch('/api/auth/check', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    })
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      // Non-JSON response, redirect to login
      authenticated.value = false
      checkingAuth.value = false
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_username')
      router.push('/login')
      return
    }
    
    const data = await response.json()
    authenticated.value = data.ok && data.authenticated
    
    if (!authenticated.value) {
      // Clear token and redirect to login
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_username')
      router.push('/login')
      return
    }
  } catch (error) {
    console.error('Auth check error:', error)
    authenticated.value = false
    // Clear token and redirect to login on error
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_username')
    router.push('/login')
  } finally {
    checkingAuth.value = false
  }
}


onMounted(() => {
  checkAuth()
})
</script>

