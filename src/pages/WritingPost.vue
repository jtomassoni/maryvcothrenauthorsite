<template>
  <div
    class="min-h-screen bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-rose-50/40 dark:from-stone-950 dark:via-amber-950/20 dark:to-rose-950/20 relative overflow-hidden"
  >
    <!-- Decorative background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute top-0 left-0 w-96 h-96 bg-amber-200/20 dark:bg-amber-900/10 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute bottom-0 right-0 w-96 h-96 bg-rose-200/20 dark:bg-rose-900/10 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-orange-200/15 dark:bg-orange-900/5 rounded-full blur-3xl"
      ></div>
    </div>

    <Container class="relative z-10">
      <div class="py-16 max-w-5xl mx-auto">
        <!-- Breadcrumbs -->
        <nav class="mb-8" aria-label="Breadcrumb">
          <ol
            class="flex items-center space-x-2 text-sm text-stone-600 dark:text-stone-400 font-serif"
          >
            <li>
              <router-link
                to="/"
                class="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
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
            <li>
              <router-link
                to="/writings"
                class="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
              >
                Writings
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
            <li
              class="text-stone-900 dark:text-stone-100 font-medium"
              aria-current="page"
            >
              {{ writing ? writing.title : 'Loading...' }}
            </li>
          </ol>
        </nav>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-16">
          <p class="text-stone-600 dark:text-stone-400 font-serif italic">
            Loading writing...
          </p>
        </div>

        <!-- Error -->
        <div
          v-else-if="error"
          class="rounded-md bg-red-50 dark:bg-red-900/20 p-4 mb-8"
        >
          <p class="text-sm text-red-800 dark:text-red-200">{{ error }}</p>
          <router-link
            to="/writings"
            class="mt-4 inline-block text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 font-serif italic transition-colors"
          >
            ← Back to Writings
          </router-link>
        </div>

        <!-- Writing Content -->
        <article
          v-else-if="writing"
          class="bg-white/70 dark:bg-stone-900/70 backdrop-blur-md border border-stone-200/70 dark:border-stone-800/70 shadow-2xl rounded-2xl overflow-hidden"
        >
          <!-- Gradient accent bar -->
          <div
            class="h-2 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 dark:from-amber-500 dark:via-orange-500 dark:to-rose-500"
          ></div>

          <div class="p-10 md:p-16">
            <!-- Header -->
            <header
              class="mb-12 text-center border-b border-stone-300/70 dark:border-stone-700/70 pb-8"
            >
              <div class="mb-6">
                <span
                  v-for="tag in writing.tags"
                  :key="tag"
                  class="inline-block px-4 py-2 text-xs font-serif italic bg-gradient-to-r from-amber-100/80 to-orange-100/80 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-800 dark:text-amber-300 border border-amber-300/50 dark:border-amber-700/50 rounded-full mr-2 mb-2"
                >
                  {{ tag }}
                </span>
              </div>
              <h1
                class="text-4xl md:text-5xl lg:text-6xl font-serif text-stone-900 dark:text-stone-100 mb-6 leading-tight tracking-tight"
              >
                {{ writing.title }}
              </h1>
              <p
                v-if="writing.excerpt"
                class="text-xl md:text-2xl text-stone-700 dark:text-stone-300 mb-6 font-light italic leading-relaxed"
              >
                {{ writing.excerpt }}
              </p>
              <p
                class="text-sm text-stone-500 dark:text-stone-500 font-serif italic"
              >
                {{ formatDate(writing.publishedAt) }}
              </p>
            </header>

            <div
              class="h-px bg-gradient-to-r from-transparent via-stone-300 dark:via-stone-700 to-transparent my-10"
            ></div>

            <!-- Content -->
            <div
              class="prose prose-lg md:prose-xl dark:prose-invert max-w-none prose-headings:font-serif prose-headings:text-stone-900 prose-headings:dark:text-stone-100 prose-p:text-stone-800 prose-p:dark:text-stone-200 prose-p:leading-relaxed prose-p:font-light prose-strong:text-stone-900 prose-strong:dark:text-stone-100 prose-strong:font-normal prose-a:text-stone-900 prose-a:dark:text-stone-100 prose-a:border-b prose-a:border-stone-400 prose-a:dark:border-stone-600 prose-a:no-underline hover:prose-a:border-stone-600 dark:hover:prose-a:border-stone-400 prose-blockquote:border-l-stone-400 prose-blockquote:dark:border-l-stone-600 prose-blockquote:text-stone-700 prose-blockquote:dark:text-stone-300 prose-blockquote:italic prose-blockquote:font-light"
            >
              <MarkdownRenderer :content="writing.contentMarkdown" />
            </div>

            <!-- Footer -->
            <footer
              class="mt-16 pt-8 border-t border-stone-300/70 dark:border-stone-700/70"
            >
              <router-link
                to="/writings"
                class="inline-flex items-center text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-serif italic font-medium transition-colors group"
              >
                <span
                  class="mr-2 group-hover:-translate-x-1 transition-transform"
                  >←</span
                >
                Back to Writings
              </router-link>
            </footer>
          </div>
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
