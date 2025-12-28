<template>
  <div class="py-16">
    <Container>
      <div class="max-w-4xl mx-auto text-center">
        <!-- 404 Content -->
        <div class="mb-12">
          <div class="text-8xl font-bold text-primary-200 mb-6">404</div>
          <h1
            class="text-4xl lg:text-5xl font-serif font-bold gradient-text mb-6"
          >
            Page Not Found
          </h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Sorry, the page you're looking for doesn't exist. It might have been
            moved, deleted, or you might have typed the wrong URL.
          </p>
        </div>

        <!-- Navigation Links -->
        <div class="mb-12">
          <h2 class="text-2xl font-semibold text-gray-800 mb-6">
            Here are some helpful links:
          </h2>
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-2xl mx-auto"
          >
            <router-link
              to="/"
              class="group bg-white border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all focus-ring"
            >
              <div
                class="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-200 transition-colors"
              >
                <svg
                  class="w-4 h-4 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  ></path>
                </svg>
              </div>
              <h3
                class="font-medium text-gray-800 group-hover:text-primary-800 transition-colors"
              >
                Home
              </h3>
            </router-link>

            <router-link
              to="/about"
              class="group bg-white border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all focus-ring"
            >
              <div
                class="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-accent-200 transition-colors"
              >
                <svg
                  class="w-4 h-4 text-accent-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
              </div>
              <h3
                class="font-medium text-gray-800 group-hover:text-primary-800 transition-colors"
              >
                About
              </h3>
            </router-link>

            <router-link
              to="/writings"
              class="group bg-white border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all focus-ring"
            >
              <div
                class="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-200 transition-colors"
              >
                <svg
                  class="w-4 h-4 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  ></path>
                </svg>
              </div>
              <h3
                class="font-medium text-gray-800 group-hover:text-primary-800 transition-colors"
              >
                Writings
              </h3>
            </router-link>

            <router-link
              to="/#contact"
              class="group bg-white border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all focus-ring"
            >
              <div
                class="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-accent-200 transition-colors"
              >
                <svg
                  class="w-4 h-4 text-accent-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <h3
                class="font-medium text-gray-800 group-hover:text-primary-800 transition-colors"
              >
                Contact
              </h3>
            </router-link>
          </div>
        </div>

        <!-- Search Suggestion -->
        <div class="bg-gray-50 rounded-lg p-8 max-w-2xl mx-auto">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">
            Looking for something specific?
          </h3>
          <p class="text-gray-600 mb-6">
            Try checking the navigation menu or use the search function to find
            what you're looking for.
          </p>
          <router-link
            to="/"
            class="inline-flex items-center gap-2 bg-primary-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors focus-ring"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            Go to Homepage
          </router-link>
        </div>
      </div>
    </Container>
  </div>
</template>

<script setup lang="ts">
import Container from '@/components/Container.vue'
</script>
