<template>
  <div class="min-h-screen bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-rose-50/40 dark:from-stone-950 dark:via-amber-950/20 dark:to-rose-950/20 relative overflow-hidden">
    <!-- Decorative background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 left-0 w-96 h-96 bg-amber-200/20 dark:bg-amber-900/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-rose-200/20 dark:bg-rose-900/10 rounded-full blur-3xl"></div>
      <div class="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-orange-200/15 dark:bg-orange-900/5 rounded-full blur-3xl"></div>
    </div>
    
    <Container class="relative z-10">
      <div class="py-16 max-w-7xl mx-auto">
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
            <li class="text-gray-900 dark:text-white font-medium" aria-current="page">
              Writings
            </li>
          </ol>
        </nav>

        <!-- Header -->
        <div class="text-center mb-16">
          <div class="inline-block mb-6">
            <div class="w-20 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 dark:from-amber-500 dark:via-orange-500 dark:to-rose-500 mx-auto rounded-full"></div>
          </div>
          <h1 class="text-5xl md:text-6xl font-serif text-stone-900 dark:text-stone-100 mb-6 tracking-tight">
            Writings
          </h1>
          <p class="text-xl text-stone-700 dark:text-stone-300 font-light italic max-w-2xl mx-auto leading-relaxed">
            A collection of stories that explore the depths of human experience and the beauty of everyday moments.
          </p>
        </div>

        <!-- Filters and Search -->
        <div class="mb-12 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div class="flex-1 w-full sm:max-w-md">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search writings..."
              class="w-full px-4 py-3 border-b-2 border-stone-300 dark:border-stone-700 bg-transparent text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-600 focus:outline-none focus:border-stone-600 dark:focus:border-stone-400 transition-colors font-serif"
              @input="debouncedSearch"
            />
          </div>
          <div class="flex gap-3 items-center">
            <div class="relative">
              <select
                v-model="tagFilter"
                class="appearance-none pl-10 pr-10 py-3 border-2 border-stone-300 dark:border-stone-700 rounded-lg bg-white/60 dark:bg-stone-900/60 backdrop-blur-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm hover:shadow-md hover:bg-white/80 dark:hover:bg-stone-900/80 transition-all cursor-pointer font-serif italic min-w-[140px]"
                @change="fetchWritings"
              >
                <option value="">All Tags</option>
                <option v-for="tag in availableTags" :key="tag" :value="tag">
                  {{ tag }}
                </option>
              </select>
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 dark:text-stone-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 dark:text-stone-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <div class="relative">
              <select
                v-model="sortBy"
                class="appearance-none pl-10 pr-10 py-3 border-2 border-stone-300 dark:border-stone-700 rounded-lg bg-white/60 dark:bg-stone-900/60 backdrop-blur-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm hover:shadow-md hover:bg-white/80 dark:hover:bg-stone-900/80 transition-all cursor-pointer font-serif italic min-w-[160px]"
                @change="fetchWritings"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
              </select>
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 dark:text-stone-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 dark:text-stone-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <label class="flex items-center gap-2 px-4 py-3 border-2 border-stone-300 dark:border-stone-700 rounded-lg bg-white/60 dark:bg-stone-900/60 backdrop-blur-sm shadow-sm hover:shadow-md hover:bg-white/80 dark:hover:bg-stone-900/80 transition-all cursor-pointer font-serif italic">
              <span class="text-sm text-stone-700 dark:text-stone-300">Show preview</span>
              <input
                v-model="showPreview"
                type="checkbox"
                class="w-4 h-4 text-amber-600 bg-stone-100 border-stone-300 rounded focus:ring-amber-500 focus:ring-2 dark:bg-stone-700 dark:border-stone-600 dark:ring-offset-stone-800"
              />
            </label>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-16">
          <p class="text-stone-600 dark:text-stone-400 font-serif italic">Loading writings...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="rounded-md bg-red-50 dark:bg-red-900/20 p-4 mb-8">
          <p class="text-sm text-red-800 dark:text-red-200">{{ error }}</p>
        </div>

        <!-- Writings List - Vertical Timeline Style -->
        <div v-else-if="writings.length > 0" class="space-y-8 mb-16">
          <article
            v-for="writing in writings"
            :key="writing.id"
            class="group relative pl-10 border-l-2 border-stone-300 dark:border-stone-700 hover:border-amber-400 dark:hover:border-amber-600 transition-all duration-300"
          >
            <!-- Timeline dot -->
            <div class="absolute left-0 top-0 -translate-x-1/2 w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 dark:from-amber-600 dark:to-orange-700 group-hover:scale-125 group-hover:shadow-lg group-hover:shadow-amber-500/50 transition-all duration-300 border-2 border-white dark:border-stone-900"></div>
            
            <!-- Content card with subtle background -->
            <div class="pb-8 pl-4 pr-4 py-4 rounded-r-lg bg-white/40 dark:bg-stone-900/40 backdrop-blur-sm border border-stone-200/50 dark:border-stone-800/50 group-hover:bg-white/60 dark:group-hover:bg-stone-900/60 group-hover:shadow-lg transition-all duration-300">
              <div class="mb-4">
                <span
                  v-for="tag in writing.tags.slice(0, 3)"
                  :key="tag"
                  class="inline-block px-3 py-1.5 text-xs font-serif italic bg-gradient-to-r from-amber-100/80 to-orange-100/80 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-800 dark:text-amber-300 border border-amber-300/50 dark:border-amber-700/50 rounded-full mr-2"
                >
                  {{ tag }}
                </span>
              </div>
              <h2 class="text-3xl font-serif text-stone-900 dark:text-stone-100 mb-3 leading-tight group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                <router-link
                  :to="`/writings/${writing.slug}`"
                  class="hover:underline"
                >
                  {{ writing.title }}
                </router-link>
              </h2>
              <p class="text-sm text-stone-500 dark:text-stone-500 mb-4 font-serif italic">
                {{ formatDate(writing.publishedAt) }}
              </p>
              <div v-if="showPreview" class="mb-4">
                <MarkdownRenderer :content="getContentPreview(writing.contentMarkdown || writing.excerpt)" size="sm" />
              </div>
              <router-link
                :to="`/writings/${writing.slug}`"
                class="inline-flex items-center text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-serif italic font-medium transition-colors group/link"
              >
                Continue reading
                <span class="ml-2 group-hover/link:translate-x-1 transition-transform">→</span>
              </router-link>
            </div>
          </article>
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-20">
          <div class="max-w-lg mx-auto">
            <div class="mb-8">
              <svg
                class="mx-auto h-24 w-24 text-amber-200 dark:text-amber-800/40 mb-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 class="text-3xl font-serif text-stone-900 dark:text-stone-100 mb-4">
              {{ searchQuery || tagFilter ? 'No writings match your filters' : 'Coming Soon' }}
            </h3>
            <p class="text-xl text-stone-600 dark:text-stone-400 font-light italic mb-8 leading-relaxed">
              {{ searchQuery || tagFilter 
                ? 'Try adjusting your search or filter criteria to discover new stories.' 
                : 'New writings are being crafted with care. Check back soon for stories that explore the depths of human experience.' }}
            </p>
            <div v-if="searchQuery || tagFilter" class="mt-8">
              <button
                @click="clearFilters"
                class="inline-flex items-center px-8 py-3 border-2 border-amber-500 dark:border-amber-400 text-amber-700 dark:text-amber-300 bg-transparent hover:bg-amber-50 dark:hover:bg-amber-900/20 focus:outline-none transition-all font-serif italic text-lg shadow-sm hover:shadow-md"
              >
                Clear filters
              </button>
            </div>
            <div v-else class="mt-8">
              <router-link
                to="/"
                class="inline-flex items-center px-8 py-3 border-2 border-amber-500 dark:border-amber-400 text-amber-700 dark:text-amber-300 bg-transparent hover:bg-amber-50 dark:hover:bg-amber-900/20 focus:outline-none transition-all font-serif italic text-lg shadow-sm hover:shadow-md"
              >
                Return to Home
              </router-link>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination && pagination.totalPages > 1" class="flex items-center justify-center gap-6 pt-8 border-t border-stone-300 dark:border-stone-700">
          <button
            @click="changePage(pagination.page - 1)"
            :disabled="pagination.page === 1"
            class="px-6 py-2 border-2 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 bg-transparent disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors font-serif"
          >
            Previous
          </button>
          <span class="text-stone-700 dark:text-stone-300 font-serif">
            Page {{ pagination.page }} of {{ pagination.totalPages }}
          </span>
          <button
            @click="changePage(pagination.page + 1)"
            :disabled="pagination.page === pagination.totalPages"
            class="px-6 py-2 border-2 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 bg-transparent disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors font-serif"
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

const writings = ref<any[]>([])
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')
const tagFilter = ref('')
const sortBy = ref('newest')
const showPreview = ref(true)
const pagination = ref<any>(null)

let searchTimeout: ReturnType<typeof setTimeout> | null = null

// Extract available tags from writings
const availableTags = computed(() => {
  const tags = new Set<string>()
  writings.value.forEach(writing => {
    writing.tags?.forEach((tag: string) => tags.add(tag))
  })
  return Array.from(tags).sort()
})

const fetchWritings = async () => {
  loading.value = true
  error.value = ''

  try {
    const params = new URLSearchParams()
    if (searchQuery.value) params.append('q', searchQuery.value)
    if (tagFilter.value) params.append('tag', tagFilter.value)
    params.append('sort', sortBy.value)
    if (pagination.value) params.append('page', pagination.value.page.toString())
    params.append('pageSize', '10')

    const response = await fetch(`/api/writings?${params.toString()}`)
    
    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      // If it's a 500 error, it might be a database connection issue
      if (response.status === 500) {
        error.value = 'Unable to connect to the server. Please try again later.'
      } else {
        error.value = 'Failed to fetch writings. Please try again.'
      }
      writings.value = []
      return
    }

    const data = await response.json()

    if (!data.ok) {
      error.value = data.error || 'Failed to fetch writings'
      writings.value = []
      return
    }

    // Successfully fetched - writings array might be empty, which is fine
    writings.value = data.writings || []
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
    console.error('Error fetching writings:', err)
    // Network errors or JSON parsing errors
    error.value = 'Unable to connect to the server. Please check your connection and try again.'
    writings.value = []
  } finally {
    loading.value = false
  }
}

const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value = { ...pagination.value, page: 1 }
    fetchWritings()
  }, 300)
}

const changePage = (page: number) => {
  if (!pagination.value) return
  pagination.value = { ...pagination.value, page }
  fetchWritings()
}

const clearFilters = () => {
  searchQuery.value = ''
  tagFilter.value = ''
  pagination.value = { ...pagination.value, page: 1 }
  fetchWritings()
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
  
  // Get first 500 characters of markdown (preserving formatting)
  const preview = content.substring(0, 500)
  
  // If content was truncated, try to end at a word boundary and add ellipsis
  if (preview.length < content.length) {
    // Find the last space or newline before the 500 char limit
    const lastSpace = Math.max(
      preview.lastIndexOf(' '),
      preview.lastIndexOf('\n'),
      preview.lastIndexOf('.')
    )
    
    // If we found a good break point (within last 50 chars), use it
    if (lastSpace > 450) {
      return preview.substring(0, lastSpace + 1) + '...'
    }
    
    return preview + '...'
  }
  
  return preview
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
  
  fetchWritings()
})
</script>
