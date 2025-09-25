<template>
  <footer class="bg-primary-800 text-white py-12">
    <Container>
      <div class="text-center">
        <h4 class="text-xl font-serif font-bold mb-4">Mary V. Cothren</h4>
        <p class="text-gray-300 mb-6">Nurse by night, writer by day</p>
        
        <!-- Navigation Links -->
        <nav class="flex justify-center space-x-6 mb-6" role="navigation" aria-label="Footer navigation">
          <router-link
            v-for="item in navItems"
            :key="item.name"
            :to="item.path"
            class="text-gray-300 hover:text-white transition-colors focus-ring rounded px-2 py-1"
          >
            {{ item.name }}
          </router-link>
        </nav>

        <!-- Contact Info -->
        <div class="mb-6">
          <p class="text-gray-300 text-sm">
            Questions? 
            <router-link
              to="/contact"
              class="text-accent-300 hover:text-accent-200 transition-colors focus-ring rounded px-1"
            >
              Get in touch
            </router-link>
          </p>
        </div>

        <!-- Copyright -->
        <p class="text-gray-400 text-sm">
          © {{ currentYear }} Mary. All rights reserved.
        </p>
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
