<template>
  <div class="py-16 min-h-screen">
    <Container>
      <div class="max-w-4xl mx-auto">
        <!-- Page Header -->
        <div class="mb-8">
          <h1 class="text-4xl font-serif font-bold gradient-text mb-4">
            Admin Dashboard
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            Content Management System
          </p>
        </div>

        <!-- Admin Content -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div class="space-y-6">
            <div>
              <h2 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Welcome, {{ username || 'Admin' }}
              </h2>
              <p class="text-gray-600 dark:text-gray-400 mb-6">
                This is your content management dashboard for writings and site content.
              </p>
            </div>

            <!-- Placeholder Sections -->
            <div class="grid md:grid-cols-2 gap-6">
              <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                  Writings
                </h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Manage your writings and drafts
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-500 italic">
                  Coming soon...
                </p>
              </div>

              <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                  Site Content
                </h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Edit pages and site content
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-500 italic">
                  Coming soon...
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Container>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Container from '@/components/Container.vue'
import { useAuth } from '@/composables/useAuth'

const { username } = useAuth()
</script>

