<template>
  <div
    id="app"
    class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
  >
    <!-- Skip to content link for accessibility -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-800 text-white px-4 py-2 rounded z-50"
    >
      Skip to main content
    </a>

    <!-- Header -->
    <AppHeader />

    <!-- Main content -->
    <main id="main-content">
      <router-view />
    </main>

    <!-- Footer -->
    <AppFooter />

    <!-- Live region for form messages -->
    <div
      id="form-messages"
      aria-live="polite"
      aria-atomic="true"
      class="sr-only"
    ></div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
</script>
