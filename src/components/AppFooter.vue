<template>
  <footer class="bg-primary-800 text-white py-6">
    <Container>
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <!-- Left: Name and Tagline -->
        <div class="text-center md:text-left">
          <h4 class="text-lg font-serif font-bold mb-1">Mary V. Cothren</h4>
          <p class="text-gray-300 text-sm">Nurse by night, writer by day</p>
        </div>
        
        <!-- Center: Navigation Links -->
        <nav class="flex justify-center space-x-4 md:space-x-6" role="navigation" aria-label="Footer navigation">
          <router-link
            v-for="item in navItems"
            :key="item.name"
            :to="item.path"
            class="text-gray-300 hover:text-white transition-colors focus-ring rounded px-2 py-1 text-sm"
          >
            {{ item.name }}
          </router-link>
        </nav>

        <!-- Right: Contact and Copyright -->
        <div class="text-center md:text-right text-sm">
          <p class="text-gray-300 mb-1">
            Questions? 
            <router-link
              to="/contact"
              class="text-accent-300 hover:text-accent-200 transition-colors focus-ring rounded px-1"
            >
              Get in touch
            </router-link>
          </p>
          <p class="text-gray-400">
            © {{ currentYear }} Mary. All rights reserved.
          </p>
        </div>
      </div>
    </Container>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Container from './Container.vue'

const currentYear = computed(() => new Date().getFullYear())

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Writings', path: '/writings' },
  { name: 'Contact', path: '/#contact' },
]
</script>
