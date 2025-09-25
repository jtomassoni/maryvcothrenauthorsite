<template>
  <div class="py-16">
    <Container>
      <div class="max-w-4xl mx-auto text-center">
        <!-- Page Header -->
        <div class="mb-12">
          <h1 class="text-4xl lg:text-5xl font-serif font-bold gradient-text mb-6">
            Writings
          </h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            A collection of stories that explore the depths of human experience and the beauty of everyday moments.
          </p>
        </div>

        <!-- Under Construction Message -->
        <div class="bg-gray-50 rounded-lg p-12 mb-12">
          <div class="max-w-2xl mx-auto">
            <div class="mb-8">
              <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
              </svg>
              <h2 class="text-2xl font-serif font-bold text-gray-800 mb-4">
                Under Construction
              </h2>
              <p class="text-gray-600 leading-relaxed">
                I'm currently working on bringing you a beautiful collection of my writings, 
                including excerpts from published works, short stories, and behind-the-scenes 
                insights into my creative process.
              </p>
            </div>

            <!-- Call to Action -->
            <div class="bg-white rounded-lg p-6 shadow-sm">
              <h3 class="text-lg font-semibold text-gray-800 mb-3">
                Don't Miss Out
              </h3>
              <p class="text-gray-600 mb-6">
                Join my mailing list to be the first to know when new content is available, 
                plus get exclusive updates and early access to new releases.
              </p>
              <router-link
                to="/#contact"
                class="inline-flex items-center gap-2 bg-primary-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors focus-ring"
              >
                Join the Mailing List
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Coming Soon Preview -->
        <div class="text-center">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">
            What's Coming Soon
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div class="bg-white rounded-lg p-6 shadow-sm">
              <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <h4 class="font-semibold text-gray-800 mb-2">Book Excerpts</h4>
              <p class="text-sm text-gray-600">First chapters and selected passages from published works</p>
            </div>
            
            <div class="bg-white rounded-lg p-6 shadow-sm">
              <div class="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                </svg>
              </div>
              <h4 class="font-semibold text-gray-800 mb-2">Writing Process</h4>
              <p class="text-sm text-gray-600">Behind-the-scenes insights and creative techniques</p>
            </div>
            
            <div class="bg-white rounded-lg p-6 shadow-sm">
              <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </div>
              <h4 class="font-semibold text-gray-800 mb-2">Short Stories</h4>
              <p class="text-sm text-gray-600">Exclusive short fiction and experimental pieces</p>
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
