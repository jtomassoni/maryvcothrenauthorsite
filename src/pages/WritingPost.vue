<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Container>
      <div class="py-12 max-w-4xl mx-auto">
        <!-- Loading -->
        <div v-if="loading" class="text-center py-12">
          <p class="text-gray-600 dark:text-gray-400">Loading writing...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="rounded-md bg-red-50 dark:bg-red-900/20 p-4 mb-8">
          <p class="text-sm text-red-800 dark:text-red-200">{{ error }}</p>
          <router-link
            to="/writings"
            class="mt-4 inline-block text-primary-800 dark:text-blue-400 hover:underline"
          >
            ← Back to Writings
          </router-link>
        </div>

        <!-- Writing Content -->
        <article v-else-if="writing" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 md:p-12">
          <!-- Header -->
          <header class="mb-8">
            <div class="mb-4">
              <span
                v-for="tag in writing.tags"
                :key="tag"
                class="inline-block px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full mr-2 mb-2"
              >
                {{ tag }}
              </span>
            </div>
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {{ writing.title }}
            </h1>
            <p v-if="writing.excerpt" class="text-xl text-gray-600 dark:text-gray-400 mb-4">
              {{ writing.excerpt }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Published on {{ formatDate(writing.publishedAt) }}
            </p>
          </header>

          <hr class="my-8 border-gray-300 dark:border-gray-600" />

          <!-- Content -->
          <div class="prose prose-lg dark:prose-invert max-w-none">
            <MarkdownRenderer :content="writing.contentMarkdown" />
          </div>

          <!-- Footer -->
          <footer class="mt-12 pt-8 border-t border-gray-300 dark:border-gray-600">
            <router-link
              to="/writings"
              class="inline-flex items-center text-primary-800 dark:text-blue-400 hover:underline"
            >
              ← Back to Writings
            </router-link>
          </footer>
        </article>
      </div>
    </Container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Container from '@/components/Container.vue'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'

const route = useRoute()

const writing = ref<any>(null)
const loading = ref(false)
const error = ref('')

const fetchWriting = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await fetch(`/api/writings/${route.params.slug}`)
    const data = await response.json()

    if (!response.ok || !data.ok) {
      error.value = data.error || 'Writing not found'
      return
    }

    writing.value = data.writing
  } catch (err) {
    console.error('Error fetching writing:', err)
    error.value = 'An error occurred while fetching the writing'
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(() => {
  fetchWriting()
})
</script>

