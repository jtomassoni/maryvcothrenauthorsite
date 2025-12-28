<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/50 relative overflow-hidden">
    <!-- Decorative background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 -left-4 w-96 h-96 bg-blue-200/20 dark:bg-blue-900/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 -right-4 w-96 h-96 bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-200/10 dark:bg-purple-900/5 rounded-full blur-3xl"></div>
    </div>
    
    <Container class="relative z-10">
      <div class="py-12 max-w-4xl mx-auto">
        <!-- Breadcrumbs -->
        <nav class="mb-6" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
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
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </li>
            <li>
              <router-link
                to="/blog"
                class="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Blog
              </router-link>
            </li>
            <li>
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </li>
            <li class="text-gray-900 dark:text-white font-medium" aria-current="page">
              {{ post ? post.title : 'Loading...' }}
            </li>
          </ol>
        </nav>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-12">
          <p class="text-gray-600 dark:text-gray-400">Loading post...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="rounded-md bg-red-50 dark:bg-red-900/20 p-4 mb-8">
          <p class="text-sm text-red-800 dark:text-red-200">{{ error }}</p>
          <router-link
            to="/blog"
            class="mt-4 inline-block text-primary-800 dark:text-blue-400 hover:underline"
          >
            ← Back to Blog
          </router-link>
        </div>

        <!-- Post Content -->
        <article v-else-if="post" class="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
          <!-- Gradient accent bar -->
          <div class="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
          
          <div class="p-8 md:p-12">
            <!-- Header -->
            <header class="mb-10">
              <div class="mb-6">
                <span
                  v-for="tag in post.tags"
                  :key="tag"
                  class="inline-block px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 rounded-full mr-2 mb-2 border border-blue-200/50 dark:border-blue-700/50"
                >
                  {{ tag }}
                </span>
              </div>
              <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-slate-100 dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent mb-6 leading-tight">
                {{ post.title }}
              </h1>
              <p v-if="post.excerpt" class="text-xl md:text-2xl text-slate-700 dark:text-slate-300 mb-6 font-medium leading-relaxed">
                {{ post.excerpt }}
              </p>
              <p class="text-sm text-slate-500 dark:text-slate-400 font-semibold">
                Published on {{ formatDate(post.publishedAt) }}
              </p>
            </header>

            <div class="h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent my-10"></div>

            <!-- Content -->
            <div class="prose prose-lg dark:prose-invert max-w-none prose-headings:text-slate-900 prose-headings:dark:text-slate-100 prose-p:text-slate-700 prose-p:dark:text-slate-300 prose-strong:text-slate-900 prose-strong:dark:text-slate-100 prose-a:text-blue-600 prose-a:dark:text-blue-400 hover:prose-a:text-blue-700 dark:hover:prose-a:text-blue-300 prose-blockquote:border-l-blue-500 prose-blockquote:dark:border-l-blue-400">
              <MarkdownRenderer :content="post.contentMarkdown" />
            </div>

            <!-- Footer -->
            <footer class="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700">
              <router-link
                to="/blog"
                class="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors group"
              >
                <span class="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
                Back to Blog
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

const post = ref<any>(null)
const loading = ref(false)
const error = ref('')

const fetchPost = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await fetch(`/api/blog/posts/${route.params.slug}`)
    const data = await response.json()

    if (!response.ok || !data.ok) {
      error.value = data.error || 'Post not found'
      return
    }

    post.value = data.post
  } catch (err) {
    console.error('Error fetching post:', err)
    error.value = 'An error occurred while fetching the post'
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
  fetchPost()
})
</script>

