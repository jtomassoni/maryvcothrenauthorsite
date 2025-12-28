<template>
  <AdminLayout 
    :title="isEdit ? (contentType === 'writing' ? 'Edit Writing' : 'Edit Post') : (contentType === 'writing' ? 'New Writing' : 'New Post')" 
    :subtitle="isEdit ? (contentType === 'writing' ? 'Update your writing' : 'Update your blog post') : (contentType === 'writing' ? 'Create a new writing (longer format)' : 'Create a new blog post (SEO & engagement)')"
  >
    <!-- Breadcrumbs -->
    <nav class="mb-3" aria-label="Breadcrumb">
      <ol class="flex items-center space-x-2 text-sm text-gray-600 dark:text-slate-400">
        <li>
          <router-link
            to="/admin"
            class="hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Admin Dashboard
          </router-link>
        </li>
        <li>
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </li>
        <li>
          <router-link
            to="/admin"
            class="hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Content Management
          </router-link>
        </li>
        <li>
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </li>
        <li class="text-gray-900 dark:text-white font-medium" aria-current="page">
          {{ isEdit ? (contentType === 'writing' ? 'Edit Writing' : 'Edit Post') : (contentType === 'writing' ? 'New Writing' : 'New Post') }}
        </li>
      </ol>
    </nav>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-600 dark:text-slate-300">Loading...</p>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-3">
      <!-- Error message -->
      <div v-if="error" class="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
        <p class="text-sm text-red-800 dark:text-red-200">{{ error }}</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left column: Form inputs -->
        <div class="space-y-3">
          <!-- Title -->
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">
              Title *
            </label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              required
              class="w-full px-3 py-1.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 rounded-md bg-white text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent text-sm"
              @input="updateSlug"
            />
          </div>

          <!-- Slug -->
          <div>
            <label for="slug" class="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
              Slug *
            </label>
            <input
              id="slug"
              v-model="form.slug"
              type="text"
              required
              pattern="[a-z0-9-]+"
              class="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 rounded-md bg-white text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent font-mono text-sm"
            />
            <p class="mt-0.5 text-xs text-gray-500 dark:text-slate-400">
              URL-friendly identifier (lowercase, hyphens only)
            </p>
          </div>

          <!-- Excerpt -->
          <div>
            <label for="excerpt" class="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
              Excerpt *
            </label>
            <textarea
              id="excerpt"
              v-model="form.excerpt"
              required
              rows="2"
              class="w-full px-3 py-1.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 rounded-md bg-white text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent text-sm"
            />
          </div>

          <!-- Tags -->
          <div>
            <label for="tags" class="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
              Tags
            </label>
            <input
              id="tags"
              v-model="tagsInput"
              type="text"
              placeholder="tag1, tag2, tag3"
              class="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 rounded-md bg-white text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
              @blur="updateTags"
            />
            <p class="mt-0.5 text-xs text-gray-500 dark:text-slate-400">
              Comma-separated list of tags
            </p>
            <div v-if="form.tags.length > 0" class="mt-2 flex flex-wrap gap-2">
              <span
                v-for="tag in form.tags"
                :key="tag"
                class="px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 dark:border dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- Status -->
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
              Status *
            </label>
            <select
              id="status"
              v-model="form.status"
              required
              class="w-full px-3 py-1.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 rounded-md bg-white text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent text-sm"
            >
              <option value="draft" class="dark:bg-slate-800">Draft</option>
              <option value="published" class="dark:bg-slate-800">Published</option>
            </select>
          </div>

          <!-- Content Markdown -->
          <div>
            <div class="flex items-center gap-2 mb-1">
              <label for="contentMarkdown" class="block text-sm font-medium text-gray-700 dark:text-slate-200">
                Content (Markdown) *
              </label>
              <button
                type="button"
                @click="showMarkdownModal = true"
                class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                title="Markdown formatting help"
              >
                Markdown hints
              </button>
              <span v-if="contentType === 'writing'" class="text-xs text-gray-500 dark:text-slate-400">
                (Longer format for writings)
              </span>
            </div>
            <textarea
              id="contentMarkdown"
              v-model="form.contentMarkdown"
              required
              :rows="contentType === 'writing' ? 12 : 8"
              class="w-full px-3 py-1.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 rounded-md bg-white text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent font-mono text-sm"
            />
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-3 pt-2 sticky top-0 bg-white dark:bg-slate-950 pb-2 z-10 border-t dark:border-slate-800 mt-2">
            <button
              type="submit"
              :disabled="saving"
              :class="contentType === 'writing' ? 'bg-purple-800 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600' : 'bg-primary-800 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600'"
              class="px-4 py-1.5 text-sm text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm dark:shadow-md"
            >
              <span v-if="!saving">{{ isEdit ? (contentType === 'writing' ? 'Update Writing' : 'Update Post') : (contentType === 'writing' ? 'Create Writing' : 'Create Post') }}</span>
              <span v-else>Saving...</span>
            </button>
            <router-link
              to="/admin"
              class="px-4 py-1.5 text-sm border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded-md hover:bg-gray-50 dark:hover:bg-slate-800 dark:bg-slate-900 transition-colors"
            >
              Cancel
            </router-link>
          </div>
        </div>

        <!-- Right column: Preview -->
        <div class="space-y-6">
          <div class="sticky top-8">
            <h3 class="text-lg font-medium text-gray-900 dark:text-slate-100 mb-4">
              Preview
            </h3>
            <div class="border border-gray-300 dark:border-slate-700 rounded-md p-6 bg-white dark:bg-slate-900 min-h-[400px] shadow-sm dark:shadow-lg">
              <div v-if="form.title" class="mb-4">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">
                  {{ form.title }}
                </h1>
                <div v-if="form.excerpt" class="text-gray-600 dark:text-slate-300 mb-4">
                  {{ form.excerpt }}
                </div>
                <div v-if="form.tags.length > 0" class="flex flex-wrap gap-2 mb-4">
                  <span
                    v-for="tag in form.tags"
                    :key="tag"
                    class="px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 dark:border dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded"
                  >
                    {{ tag }}
                  </span>
                </div>
                <hr class="my-4 border-gray-300 dark:border-slate-700" />
              </div>
              <MarkdownRenderer :content="form.contentMarkdown || '*Start typing to see preview...*'" />
            </div>
          </div>
        </div>
      </div>
    </form>

    <!-- Markdown Hints Modal -->
    <div
      v-if="showMarkdownModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-70"
      @click.self="showMarkdownModal = false"
    >
      <div class="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-900 dark:text-slate-100">Markdown Formatting Guide</h2>
          <button
            @click="showMarkdownModal = false"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
            aria-label="Close modal"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="px-6 py-4 overflow-y-auto flex-1">
          <div class="space-y-6 text-sm text-gray-700 dark:text-slate-300">
            <!-- Headers -->
            <div>
              <h3 class="text-base font-semibold text-gray-900 dark:text-slate-100 mb-2">Headers</h3>
              <div class="bg-gray-50 dark:bg-slate-800 p-3 rounded font-mono text-xs">
                <div># H1 Header</div>
                <div>## H2 Header</div>
                <div>### H3 Header</div>
              </div>
            </div>

            <!-- Emphasis -->
            <div>
              <h3 class="text-base font-semibold text-gray-900 dark:text-slate-100 mb-2">Emphasis</h3>
              <div class="bg-gray-50 dark:bg-slate-800 p-3 rounded font-mono text-xs space-y-1">
                <div>*italic* or _italic_</div>
                <div>**bold** or __bold__</div>
                <div>***bold italic***</div>
                <div>~~strikethrough~~</div>
              </div>
            </div>

            <!-- Lists -->
            <div>
              <h3 class="text-base font-semibold text-gray-900 dark:text-slate-100 mb-2">Lists</h3>
              <div class="bg-gray-50 dark:bg-slate-800 p-3 rounded font-mono text-xs space-y-1">
                <div>Unordered:</div>
                <div class="ml-2">- Item 1</div>
                <div class="ml-2">- Item 2</div>
                <div class="mt-2">Ordered:</div>
                <div class="ml-2">1. First item</div>
                <div class="ml-2">2. Second item</div>
              </div>
            </div>

            <!-- Links -->
            <div>
              <h3 class="text-base font-semibold text-gray-900 dark:text-slate-100 mb-2">Links</h3>
              <div class="bg-gray-50 dark:bg-slate-800 p-3 rounded font-mono text-xs space-y-1">
                <div>[Link text](https://example.com)</div>
                <div>[Link with title](https://example.com "Title")</div>
              </div>
            </div>

            <!-- Images -->
            <div>
              <h3 class="text-base font-semibold text-gray-900 dark:text-slate-100 mb-2">Images</h3>
              <div class="bg-gray-50 dark:bg-slate-800 p-3 rounded font-mono text-xs">
                <div>![Alt text](image-url.jpg)</div>
                <div class="mt-1">![Alt text](image-url.jpg "Image title")</div>
              </div>
            </div>

            <!-- Code -->
            <div>
              <h3 class="text-base font-semibold text-gray-900 dark:text-slate-100 mb-2">Code</h3>
              <div class="bg-gray-50 dark:bg-slate-800 p-3 rounded font-mono text-xs space-y-1">
                <div>Inline: `code`</div>
                <div class="mt-2">Code block:</div>
                <div class="ml-2">```</div>
                <div class="ml-2">code here</div>
                <div class="ml-2">```</div>
              </div>
            </div>

            <!-- Blockquotes -->
            <div>
              <h3 class="text-base font-semibold text-gray-900 dark:text-slate-100 mb-2">Blockquotes</h3>
              <div class="bg-gray-50 dark:bg-slate-800 p-3 rounded font-mono text-xs">
                <div>&gt; This is a quote</div>
                <div>&gt; Multiple lines</div>
              </div>
            </div>

            <!-- Horizontal Rule -->
            <div>
              <h3 class="text-base font-semibold text-gray-900 dark:text-slate-100 mb-2">Horizontal Rule</h3>
              <div class="bg-gray-50 dark:bg-slate-800 p-3 rounded font-mono text-xs">
                <div>---</div>
                <div>or</div>
                <div>***</div>
              </div>
            </div>

            <!-- Line Breaks -->
            <div>
              <h3 class="text-base font-semibold text-gray-900 dark:text-slate-100 mb-2">Line Breaks</h3>
              <div class="bg-gray-50 dark:bg-slate-800 p-3 rounded text-xs">
                <div>End a line with two spaces for a line break</div>
                <div class="mt-1">Or use a blank line for a paragraph break</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-4 border-t border-gray-200 dark:border-slate-700 flex justify-end">
          <button
            @click="showMarkdownModal = false"
            class="px-4 py-2 bg-primary-800 dark:bg-primary-700 text-white rounded-md hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors text-sm"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AdminLayout from '@/components/AdminLayout.vue'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'

const router = useRouter()
const route = useRoute()

const isEdit = computed(() => !!route.params.id)
const currentType = ref<'blog' | 'writing'>('blog')
const contentType = computed(() => {
  // Check query param first (for new items)
  if (route.query.type === 'writing' || route.query.type === 'blog') {
    return route.query.type
  }
  // For editing, we'll determine from the loaded data
  return currentType.value || 'blog'
})

const loading = ref(false)
const saving = ref(false)
const error = ref('')
const showMarkdownModal = ref(false)

const form = ref({
  title: '',
  slug: '',
  excerpt: '',
  contentMarkdown: '',
  tags: [] as string[],
  status: 'draft',
})

const tagsInput = ref('')

const updateSlug = () => {
  if (!isEdit.value) {
    // Auto-generate slug from title (only for new posts)
    const slug = form.value.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
    form.value.slug = slug
  }
}

const updateTags = () => {
  form.value.tags = tagsInput.value
    .split(',')
    .map(t => t.trim())
    .filter(t => t)
  tagsInput.value = form.value.tags.join(', ')
}

const loadPost = async () => {
  if (!isEdit.value) {
    // Set type from query param for new items
    if (route.query.type === 'writing') {
      currentType.value = 'writing'
    } else if (route.query.type === 'blog') {
      currentType.value = 'blog'
    }
    return
  }

  loading.value = true
  error.value = ''

  try {
    // Get token from localStorage
    const token = localStorage.getItem('auth_token')
    const headers: Record<string, string> = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // Try to determine type from query param or try both endpoints
    const typeFromQuery = route.query.type as string
    let response, data

    if (typeFromQuery === 'writing') {
      response = await fetch(`/api/admin/writings/${route.params.id}`, {
        headers,
        credentials: 'include',
      })
      data = await response.json()
      if (response.ok && data.ok) {
        currentType.value = 'writing'
      }
    } else if (typeFromQuery === 'blog') {
      response = await fetch(`/api/admin/blog/posts/${route.params.id}`, {
        headers,
        credentials: 'include',
      })
      data = await response.json()
      if (response.ok && data.ok) {
        currentType.value = 'blog'
      }
    } else {
      // Try blog first, then writing
      response = await fetch(`/api/admin/blog/posts/${route.params.id}`, {
        headers,
        credentials: 'include',
      })
      data = await response.json()
      if (response.ok && data.ok) {
        currentType.value = 'blog'
      } else {
        response = await fetch(`/api/admin/writings/${route.params.id}`, {
          headers,
          credentials: 'include',
        })
        data = await response.json()
        if (response.ok && data.ok) {
          currentType.value = 'writing'
        }
      }
    }

    if (!response.ok || !data.ok) {
      error.value = data.error || 'Failed to load content'
      return
    }

    const item = data.post || data.writing
    form.value = {
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      contentMarkdown: item.contentMarkdown,
      tags: item.tags || [],
      status: item.status,
    }

    tagsInput.value = form.value.tags.join(', ')
  } catch (err) {
    console.error('Error loading content:', err)
    error.value = 'An error occurred while loading the content'
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  saving.value = true
  error.value = ''

  try {
    const type = contentType.value
    const url = isEdit.value
      ? (type === 'writing' 
          ? `/api/admin/writings/${route.params.id}`
          : `/api/admin/blog/posts/${route.params.id}`)
      : (type === 'writing'
          ? '/api/admin/writings'
          : '/api/admin/blog/posts')

    const method = isEdit.value ? 'PUT' : 'POST'

    // Get token from localStorage
    const token = localStorage.getItem('auth_token')
    const headers = {
      'Content-Type': 'application/json',
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(url, {
      method,
      headers,
      credentials: 'include',
      body: JSON.stringify({
        ...form.value,
        tags: form.value.tags,
      }),
    })

    // Check if response is JSON
    const responseContentType = response.headers.get('content-type')
    if (!responseContentType || !responseContentType.includes('application/json')) {
      const text = await response.text()
      console.error('Non-JSON response:', text)
      error.value = `Server error: ${response.status} ${response.statusText}`
      saving.value = false
      return
    }

    const data = await response.json()

    if (!response.ok || !data.ok) {
      console.error('Save error:', data)
      error.value = data.error || data.message || `Failed to save ${type === 'writing' ? 'writing' : 'post'}`
      saving.value = false
      return
    }

    // Redirect to list
    router.push('/admin')
  } catch (err) {
    console.error('Error saving content:', err)
    error.value = err instanceof Error ? err.message : 'An error occurred while saving'
    saving.value = false
  }
}

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && showMarkdownModal.value) {
    showMarkdownModal.value = false
  }
}

onMounted(() => {
  loadPost()
  window.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscape)
})
</script>

