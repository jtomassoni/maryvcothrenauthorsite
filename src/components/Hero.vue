<template>
  <section class="py-20 lg:py-32 bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
    <Container>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <!-- Hero Content -->
        <div class="lg:col-span-1 space-y-4 flex flex-col justify-center">
          <div class="space-y-3">
            <h1 class="text-2xl lg:text-3xl font-serif font-bold leading-tight">
              <span class="gradient-text">{{ title }}</span>
            </h1>
            
            <div class="text-base lg:text-lg text-gray-600 leading-relaxed">
              <p>{{ subtitle }}</p>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-3">
            <router-link
              :to="ctaHref"
              class="group bg-primary-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-center focus-ring text-sm"
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

        <!-- Hero Image -->
        <div class="lg:col-span-1 relative flex justify-center">
          <div class="relative">
            <!-- Image Container -->
            <div class="relative w-96 h-96 lg:w-[32rem] lg:h-[32rem] rounded-3xl overflow-hidden shadow-2xl">
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
