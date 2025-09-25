<template>
  <div class="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
    <Container>
      <div class="max-w-4xl mx-auto text-center">
        <!-- Page Header -->
        <div class="mb-12">
          <h1 class="text-4xl lg:text-5xl font-serif font-bold gradient-text dark:bg-gradient-to-r dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 dark:bg-clip-text dark:text-transparent mb-6">
            Writings
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A collection of stories that explore the depths of human experience and the beauty of everyday moments.
          </p>
        </div>

        <!-- Under Construction Message -->
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-12 mb-12 border dark:border-gray-700">
          <div class="max-w-2xl mx-auto">
            <div class="mb-8">
              <svg class="w-16 h-16 text-gray-400 dark:text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
              </svg>
              <h2 class="text-2xl font-serif font-bold text-gray-800 dark:text-gray-200 mb-4">
                Under Construction
              </h2>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                I'm currently working on bringing you a beautiful collection of my writings, 
                including excerpts from published works, short stories, and behind-the-scenes 
                insights into my creative process.
              </p>
            </div>

            <!-- Call to Action -->
            <div class="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm dark:shadow-gray-900/50 border dark:border-gray-600">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                Don't Miss Out
              </h3>
              <p class="text-gray-600 dark:text-gray-300 mb-6">
                Join my mailing list to be the first to know when new content is available, 
                plus get exclusive updates and early access to new releases.
              </p>
              <router-link
                to="/#contact"
                class="inline-flex items-center gap-2 bg-gradient-to-r from-primary-800 to-primary-700 dark:from-blue-600 dark:to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-primary-700 hover:to-primary-600 dark:hover:from-blue-500 dark:hover:to-purple-500 transition-all duration-300 focus-ring shadow-lg dark:shadow-blue-500/30"
              >
                Join the Mailing List
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </Container>
  </div>
</template>

<script setup lang="ts">
import Container from '@/components/Container.vue'
</script>
