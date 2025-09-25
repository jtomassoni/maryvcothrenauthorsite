<template>
  <section class="py-20 lg:py-32 bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 relative overflow-hidden">
    <!-- Background Effects -->
    <div class="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-pink-500/20"></div>
    <div class="absolute top-0 left-0 w-full h-full">
      <div class="absolute top-20 left-10 w-72 h-72 bg-blue-600/15 dark:bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-blue-700/10 dark:bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-800/8 dark:bg-pink-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
    </div>
    
    <Container class="relative z-10">
      <!-- Mobile Image (shown first on mobile) -->
      <div class="lg:hidden relative flex justify-center mb-8">
        <div class="relative">
          <!-- Mobile Image Container -->
          <div class="relative w-48 h-48 rounded-2xl overflow-hidden shadow-xl shadow-blue-900/20">
            <img
              :src="imageSrc"
              :alt="imageAlt"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <!-- Hero Content -->
        <div class="lg:col-span-1 space-y-4 flex flex-col justify-center">
          <div class="space-y-3">
            <h1 class="text-4xl lg:text-6xl font-serif font-bold leading-tight">
              <span class="gradient-text dark:bg-gradient-to-r dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 dark:bg-clip-text dark:text-transparent">
                {{ title }}
              </span>
            </h1>
            
            <h2 v-if="subheading" class="text-3xl lg:text-4xl font-serif font-medium gradient-text dark:text-blue-300 italic">
              {{ subheading }}
            </h2>
            
            <div class="text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>{{ subtitle }}</p>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-3">
            <router-link
              :to="ctaHref"
              class="group bg-gradient-to-r from-primary-800 to-primary-700 dark:from-blue-600 dark:to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-primary-700 hover:to-primary-600 dark:hover:from-blue-500 dark:hover:to-purple-500 transition-all duration-300 transform hover:scale-105 hover:shadow-xl dark:hover:shadow-blue-500/30 text-center focus-ring text-sm"
            >
              <span class="flex items-center justify-center gap-2">
                {{ ctaText }}
                <svg class="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </span>
            </router-link>
          </div>
        </div>

        <!-- Desktop Hero Image (hidden on mobile) -->
        <div class="hidden lg:block lg:col-span-1 relative flex justify-center">
          <div class="relative">
            <!-- Desktop Image Container -->
            <div class="relative w-[32rem] h-[32rem] rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/20 dark:shadow-blue-500/20 dark:ring-2 dark:ring-blue-500/30">
              <img
                :src="imageSrc"
                :alt="imageAlt"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  </section>
</template>

<script setup lang="ts">
import Container from './Container.vue'

interface Props {
  title: string
  subheading?: string
  subtitle: string
  ctaText: string
  ctaHref: string
  imageSrc: string
  imageAlt: string
  imageOverlayText?: string
}

withDefaults(defineProps<Props>(), {
  imageOverlayText: 'Learn More'
})
</script>
