<template>
  <div
    class="min-h-screen bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-rose-50/40 dark:from-stone-950 dark:via-amber-950/20 dark:to-rose-950/20 relative overflow-hidden"
  >
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute top-0 left-0 w-96 h-96 bg-amber-200/20 dark:bg-amber-900/10 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute bottom-0 right-0 w-96 h-96 bg-rose-200/20 dark:bg-rose-900/10 rounded-full blur-3xl"
      ></div>
    </div>

    <Container class="relative z-10">
      <div class="py-16 max-w-5xl mx-auto text-center space-y-10">
        <div>
          <nav class="mb-6" aria-label="Breadcrumb">
            <ol
              class="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400"
            >
              <li>
                <router-link
                  to="/"
                  class="hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Home
                </router-link>
              </li>
              <li>
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </li>
              <li class="text-gray-900 dark:text-white font-medium" aria-current="page">
                Writings
              </li>
            </ol>
          </nav>

          <h1
            class="text-5xl md:text-6xl font-serif text-stone-900 dark:text-stone-100 mb-4 tracking-tight"
          >
            Writings
          </h1>
          <p class="text-xl text-stone-700 dark:text-stone-300 font-light italic max-w-3xl mx-auto">
            The writing archive is taking a short break. New stories are on the way—check back
            soon.
          </p>
        </div>

        <div
          class="bg-white/70 dark:bg-stone-900/70 backdrop-blur-md border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xl p-10"
        >
          <div class="flex flex-col items-center gap-6">
            <svg
              class="w-16 h-16 text-amber-500 dark:text-amber-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <div class="space-y-2">
              <h2 class="text-3xl font-serif text-stone-900 dark:text-stone-100">Coming soon</h2>
              <p class="text-lg text-stone-600 dark:text-stone-400 max-w-2xl">
                Mary is polishing new essays and stories. In the meantime, feel free to explore the
                site or drop a note to get updates when new writing goes live.
              </p>
            </div>
            <div class="flex flex-wrap justify-center gap-4">
              <router-link
                to="/"
                class="inline-flex items-center px-6 py-3 rounded-lg border-2 border-amber-500 dark:border-amber-400 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 font-semibold transition-colors"
              >
                Return to Home
              </router-link>
              <router-link
                to="/contact"
                class="inline-flex items-center px-6 py-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-colors"
              >
                Get Updates
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
