<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Container>
      <div class="py-12">
        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Blog
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-400">
            Thoughts, stories, and updates
          </p>
        </div>

        <!-- Filters and Search -->
        <div class="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div class="flex-1 w-full sm:max-w-md">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search posts..."
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              @input="debouncedSearch"
            />
          </div>
          <div class="flex gap-4 items-center">
            <select
              v-model="tagFilter"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              @change="fetchPosts"
            >
              <option value="">All Tags</option>
              <option v-for="tag in availableTags" :key="tag" :value="tag">
                {{ tag }}
              </option>
            </select>
            <select
              v-model="sortBy"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              @change="fetchPosts"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
            </select>
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
            class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
          >
            <div class="p-6">
              <div class="mb-2">
                <span
                  v-for="tag in post.tags.slice(0, 3)"
                  :key="tag"
                  class="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded mr-2"
                >
                  {{ tag }}
                </span>
              </div>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                <router-link
                  :to="`/blog/${post.slug}`"
                  class="hover:text-primary-800 dark:hover:text-blue-400 transition-colors"
                >
                  {{ post.title }}
                </router-link>
              </h2>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
                {{ formatDate(post.publishedAt) }}
              </p>
              <p class="text-gray-600 dark:text-gray-400 line-clamp-3">
                {{ post.excerpt }}
              </p>
              <router-link
                :to="`/blog/${post.slug}`"
                class="inline-block mt-4 text-primary-800 dark:text-blue-400 hover:underline"
              >
                Read more →
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

const route = useRoute()
const router = useRouter()

const posts = ref<any[]>([])
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')
const tagFilter = ref('')
const sortBy = ref('newest')
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

