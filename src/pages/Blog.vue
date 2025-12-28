<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/50 relative overflow-hidden">
    <!-- Decorative background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 -left-4 w-96 h-96 bg-blue-200/20 dark:bg-blue-900/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 -right-4 w-96 h-96 bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-200/10 dark:bg-purple-900/5 rounded-full blur-3xl"></div>
    </div>
    
    <Container class="relative z-10">
      <div class="py-6">
        <!-- Breadcrumbs -->
        <nav class="mb-4" aria-label="Breadcrumb">
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
            <li class="text-gray-900 dark:text-white font-medium" aria-current="page">
              Blog
            </li>
          </ol>
        </nav>

        <!-- Header -->
        <div class="text-center mb-8">
          <div class="inline-block mb-3">
            <div class="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 mx-auto rounded-full"></div>
          </div>
          <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-slate-100 dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent mb-2">
            Blog
          </h1>
          <p class="text-lg text-slate-700 dark:text-slate-300 font-medium">
            Thoughts, stories, and updates
          </p>
        </div>

        <!-- Filters and Search -->
        <div class="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div class="flex-1 w-full sm:max-w-md">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search posts..."
              class="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-700 rounded-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all"
              @input="debouncedSearch"
            />
          </div>
          <div class="flex gap-3 items-center">
            <div class="relative">
              <select
                v-model="tagFilter"
                class="appearance-none pl-10 pr-10 py-3 border-2 border-slate-300 dark:border-slate-700 rounded-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm hover:shadow-md transition-all cursor-pointer font-medium min-w-[140px]"
                @change="fetchPosts"
              >
                <option value="">All Tags</option>
                <option v-for="tag in availableTags" :key="tag" :value="tag">
                  {{ tag }}
                </option>
              </select>
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <div class="relative">
              <select
                v-model="sortBy"
                class="appearance-none pl-10 pr-10 py-3 border-2 border-slate-300 dark:border-slate-700 rounded-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm hover:shadow-md transition-all cursor-pointer font-medium min-w-[160px]"
                @change="fetchPosts"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
              </select>
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <label class="flex items-center gap-2 px-4 py-3 border-2 border-slate-300 dark:border-slate-700 rounded-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all cursor-pointer font-medium">
              <span class="text-sm text-slate-700 dark:text-slate-300">Show preview</span>
              <input
                v-model="showPreview"
                type="checkbox"
                class="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 focus:ring-2 dark:bg-slate-700 dark:border-slate-600 dark:ring-offset-slate-800"
              />
            </label>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-12">
          <p class="text-gray-600 dark:text-gray-400">Loading posts...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="rounded-md bg-red-50 dark:bg-red-900/20 p-4 mb-8">
          <p class="text-sm text-red-800 dark:text-red-200">{{ error }}</p>
        </div>

        <!-- Posts Grid -->
        <div v-else-if="posts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <article
            v-for="post in posts"
            :key="post.id"
            class="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-700 hover:-translate-y-1"
          >
            <!-- Gradient accent bar -->
            <div class="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
            <div class="p-6">
              <div class="mb-3">
                <span
                  v-for="tag in post.tags.slice(0, 3)"
                  :key="tag"
                  class="inline-block px-3 py-1 text-xs font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 rounded-full mr-2 border border-blue-200/50 dark:border-blue-700/50"
                >
                  {{ tag }}
                </span>
              </div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                <router-link
                  :to="`/blog/${post.slug}`"
                  class="hover:underline"
                >
                  {{ post.title }}
                </router-link>
              </h2>
              <p class="text-sm text-slate-500 dark:text-slate-400 mb-3 font-medium">
                {{ formatDate(post.publishedAt) }}
              </p>
              <div v-if="showPreview" class="mb-4">
                <MarkdownRenderer :content="getContentPreview(post.contentMarkdown || post.excerpt)" size="sm" />
              </div>
              <router-link
                :to="`/blog/${post.slug}`"
                class="inline-flex items-center mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold group/link transition-colors"
              >
                Read more
                <span class="ml-2 group-hover/link:translate-x-1 transition-transform">→</span>
              </router-link>
            </div>
          </article>
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-12">
          <div class="max-w-md mx-auto">
            <svg
              class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {{ searchQuery || tagFilter ? 'No posts match your filters' : 'No posts yet' }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ searchQuery || tagFilter 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Check back soon for new content!' }}
            </p>
            <div v-if="searchQuery || tagFilter" class="mt-4">
              <button
                @click="clearFilters"
                class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Clear filters
              </button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination && pagination.totalPages > 1" class="flex items-center justify-center gap-4">
          <button
            @click="changePage(pagination.page - 1)"
            :disabled="pagination.page === 1"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Previous
          </button>
          <span class="text-gray-700 dark:text-gray-300">
            Page {{ pagination.page }} of {{ pagination.totalPages }}
          </span>
          <button
            @click="changePage(pagination.page + 1)"
            :disabled="pagination.page === pagination.totalPages"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </Container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Container from '@/components/Container.vue'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'

const route = useRoute()
const router = useRouter()

const posts = ref<any[]>([])
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')
const tagFilter = ref('')
const sortBy = ref('newest')
const showPreview = ref(false)
const pagination = ref<any>(null)

let searchTimeout: ReturnType<typeof setTimeout> | null = null

// Extract available tags from posts
const availableTags = computed(() => {
  const tags = new Set<string>()
  posts.value.forEach(post => {
    post.tags?.forEach((tag: string) => tags.add(tag))
  })
  return Array.from(tags).sort()
})

const fetchPosts = async () => {
  loading.value = true
  error.value = ''

  try {
    const params = new URLSearchParams()
    if (searchQuery.value) params.append('q', searchQuery.value)
    if (tagFilter.value) params.append('tag', tagFilter.value)
    params.append('sort', sortBy.value)
    if (pagination.value) params.append('page', pagination.value.page.toString())
    params.append('pageSize', '10')

    const response = await fetch(`/api/blog/posts?${params.toString()}`)
    
    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      // If it's a 500 error, it might be a database connection issue
      if (response.status === 500) {
        error.value = 'Unable to connect to the server. Please try again later.'
      } else {
        error.value = 'Failed to fetch posts. Please try again.'
      }
      posts.value = []
      return
    }

    const data = await response.json()

    if (!data.ok) {
      error.value = data.error || 'Failed to fetch posts'
      posts.value = []
      return
    }

    // Successfully fetched - posts array might be empty, which is fine
    posts.value = data.posts || []
    pagination.value = data.pagination

    // Update URL without reload
    const newQuery = { ...route.query }
    if (searchQuery.value) newQuery.q = searchQuery.value
    else delete newQuery.q
    if (tagFilter.value) newQuery.tag = tagFilter.value
    else delete newQuery.tag
    if (sortBy.value !== 'newest') newQuery.sort = sortBy.value
    else delete newQuery.sort
    if (pagination.value && pagination.value.page > 1) newQuery.page = pagination.value.page.toString()
    else delete newQuery.page

    router.replace({ query: newQuery })
  } catch (err) {
    console.error('Error fetching posts:', err)
    // Network errors or JSON parsing errors
    error.value = 'Unable to connect to the server. Please check your connection and try again.'
    posts.value = []
  } finally {
    loading.value = false
  }
}

const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value = { ...pagination.value, page: 1 }
    fetchPosts()
  }, 300)
}

const changePage = (page: number) => {
  if (!pagination.value) return
  pagination.value = { ...pagination.value, page }
  fetchPosts()
}

const clearFilters = () => {
  searchQuery.value = ''
  tagFilter.value = ''
  pagination.value = { ...pagination.value, page: 1 }
  fetchPosts()
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const getContentPreview = (content: string) => {
  if (!content) return ''
  
  // Get exactly first 100 characters of markdown (including markdown syntax)
  if (content.length <= 100) {
    return content
  }
  
  return content.substring(0, 100) + '...'
}

onMounted(() => {
  // Initialize from query params
  searchQuery.value = (route.query.q as string) || ''
  tagFilter.value = (route.query.tag as string) || ''
  sortBy.value = (route.query.sort as string) || 'newest'
  
  pagination.value = {
    page: parseInt((route.query.page as string) || '1', 10),
    pageSize: 10,
    total: 0,
    totalPages: 1,
  }
  
  fetchPosts()
})
</script>

