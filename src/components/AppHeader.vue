<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <Container>
      <div class="flex justify-between items-center py-6">
        <!-- Logo -->
        <router-link
          to="/"
          class="text-2xl font-serif font-bold gradient-text focus-ring rounded"
        >
          Mary V. Cothren
        </router-link>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex space-x-8" role="navigation" aria-label="Main navigation">
          <router-link
            v-for="item in navItems"
            :key="item.name"
            :to="item.path"
            class="text-gray-600 hover:text-primary-800 transition-colors focus-ring rounded px-2 py-1"
            :class="{ 'text-primary-800 font-medium': $route.path === item.path }"
          >
            {{ item.name }}
          </router-link>
        </nav>

        <!-- Mobile Menu Button -->
        <button
          class="md:hidden p-2 focus-ring rounded"
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
        class="md:hidden border-t border-gray-200 py-4"
        role="navigation"
        aria-label="Mobile navigation"
      >
        <nav class="flex flex-col space-y-2">
          <router-link
            v-for="item in navItems"
            :key="item.name"
            :to="item.path"
            class="text-gray-600 hover:text-primary-800 transition-colors focus-ring rounded px-2 py-2"
            :class="{ 'text-primary-800 font-medium': $route.path === item.path }"
            @click="closeMobileMenu"
          >
            {{ item.name }}
          </router-link>
        </nav>
      </div>
    </Container>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Container from './Container.vue'

const isMobileMenuOpen = ref(false)

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Writings', path: '/writings' },
  { name: 'Contact', path: '/#contact' },
]

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>
