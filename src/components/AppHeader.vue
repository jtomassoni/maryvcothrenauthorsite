<template>
  <header class="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm dark:shadow-gray-800/50 sticky top-0 z-50 transition-all duration-300">
    <Container>
      <div class="flex justify-between items-center py-6">
        <!-- Logo -->
        <router-link
          to="/"
          class="text-2xl font-serif font-bold bg-gradient-to-r from-primary-800 via-primary-700 to-primary-900 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent focus-ring rounded transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/20 dark:hover:shadow-blue-400/30"
          @click="scrollToTop"
        >
          Mary V. Cothren
        </router-link>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
          <router-link
            v-for="item in navItems"
            :key="item.name"
            :to="item.hash ? { path: item.path, hash: item.hash } : item.path"
            class="text-gray-600 dark:text-gray-300 hover:text-primary-800 dark:hover:text-blue-400 transition-all duration-300 focus-ring rounded px-3 py-2 hover:shadow-md hover:shadow-primary-500/20 dark:hover:shadow-blue-400/30 hover:bg-gray-50 dark:hover:bg-gray-800/50 font-medium"
            :class="{ 
              'text-primary-800 dark:text-blue-400 shadow-sm shadow-primary-500/20 dark:shadow-blue-400/30 bg-gray-50 dark:bg-gray-800/50': 
                item.name === 'Contact' ? $route.hash === '#contact' : 
                item.name === 'Home' ? $route.path === '/' && $route.hash !== '#contact' : 
                $route.path === item.path 
            }"
          >
            {{ item.name }}
          </router-link>
          
          <!-- Dark Mode Toggle -->
          <button
            @click="toggleDarkMode"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 focus-ring hover:shadow-md hover:shadow-gray-500/20 dark:hover:shadow-gray-400/30"
            :aria-label="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <svg v-if="!isDarkMode" class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
            </svg>
            <svg v-else class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
          </button>
        </nav>

        <!-- Mobile Menu Button -->
        <button
          class="md:hidden p-2 focus-ring rounded transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-md hover:shadow-gray-500/20 dark:hover:shadow-gray-400/30"
          @click="toggleMobileMenu"
          :aria-expanded="isMobileMenuOpen"
          aria-controls="mobile-menu"
          aria-label="Toggle mobile menu"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            :class="{ 'rotate-90': isMobileMenuOpen }"
          >
            <path
              v-if="!isMobileMenuOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Mobile Navigation -->
      <div
        v-if="isMobileMenuOpen"
        id="mobile-menu"
        class="md:hidden border-t border-gray-200 dark:border-gray-700 py-4"
        role="navigation"
        aria-label="Mobile navigation"
      >
        <nav class="flex flex-col space-y-2">
          <router-link
            v-for="item in navItems"
            :key="item.name"
            :to="item.hash ? { path: item.path, hash: item.hash } : item.path"
            class="text-gray-600 dark:text-gray-300 hover:text-primary-800 dark:hover:text-blue-400 transition-all duration-300 focus-ring rounded px-3 py-2 hover:shadow-md hover:shadow-primary-500/20 dark:hover:shadow-blue-400/30 hover:bg-gray-50 dark:hover:bg-gray-800/50 font-medium"
            :class="{ 
              'text-primary-800 dark:text-blue-400 shadow-sm shadow-primary-500/20 dark:shadow-blue-400/30 bg-gray-50 dark:bg-gray-800/50': 
                item.name === 'Contact' ? $route.hash === '#contact' : 
                item.name === 'Home' ? $route.path === '/' && $route.hash !== '#contact' : 
                $route.path === item.path 
            }"
            @click="closeMobileMenu"
          >
            {{ item.name }}
          </router-link>
          
          <!-- Mobile Dark Mode Toggle -->
          <button
            @click="toggleDarkMode"
            class="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary-800 dark:hover:text-blue-400 transition-all duration-300 focus-ring rounded px-3 py-2 hover:shadow-md hover:shadow-primary-500/20 dark:hover:shadow-blue-400/30 hover:bg-gray-50 dark:hover:bg-gray-800/50"
          >
            <svg v-if="!isDarkMode" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
            </svg>
            <svg v-else class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            {{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}
          </button>
        </nav>
      </div>
    </Container>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Container from './Container.vue'

const isMobileMenuOpen = ref(false)
const isDarkMode = ref(false)

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Writings', path: '/writings' },
  { name: 'Contact', path: '/', hash: '#contact' },
]

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('darkMode', 'true')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('darkMode', 'false')
  }
}

onMounted(() => {
  const savedDarkMode = localStorage.getItem('darkMode')
  if (savedDarkMode === 'true') {
    isDarkMode.value = true
    document.documentElement.classList.add('dark')
  }
})
</script>
