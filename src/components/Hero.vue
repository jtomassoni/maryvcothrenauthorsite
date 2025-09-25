<template>
  <section class="py-20 lg:py-32 bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
    <Container>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Hero Content -->
        <div class="space-y-8">
          <div class="space-y-6">
            <h1 class="text-5xl lg:text-7xl font-serif font-bold leading-tight">
              <span class="gradient-text">{{ title }}</span>
            </h1>
            
            <div class="text-xl lg:text-2xl text-gray-600 leading-relaxed">
              <p>{{ subtitle }}</p>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-3">
            <router-link
              :to="ctaHref"
              class="group bg-primary-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-center focus-ring"
            >
              <span class="flex items-center justify-center gap-2">
                {{ ctaText }}
                <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </span>
            </router-link>
          </div>
        </div>

        <!-- Hero Image -->
        <div class="relative flex justify-center lg:justify-end">
          <div class="relative group">
            <!-- Glow Effect -->
            <div class="absolute inset-0 bg-gradient-to-br from-primary-200 to-accent-200 rounded-3xl blur-3xl scale-110 group-hover:scale-125 transition-transform duration-500 opacity-40"></div>
            
            <!-- Image Container -->
            <div class="relative w-80 h-80 lg:w-96 lg:h-96 rounded-3xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all duration-500 transform group-hover:scale-105">
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
