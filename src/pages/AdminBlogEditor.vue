<template>
  <AdminLayout 
    :title="isEdit ? (contentType === 'writing' ? 'Edit Writing' : 'Edit Post') : (contentType === 'writing' ? 'New Writing' : 'New Post')" 
    :subtitle="isEdit ? (contentType === 'writing' ? 'Update your writing' : 'Update your blog post') : (contentType === 'writing' ? 'Create a new writing (longer format)' : 'Create a new blog post (SEO & engagement)')"
  >
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-600 dark:text-gray-400">Loading...</p>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Error message -->
      <div v-if="error" class="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
        <p class="text-sm text-red-800 dark:text-red-200">{{ error }}</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left column: Form inputs -->
        <div class="space-y-6">
          <!-- Title -->
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title *
            </label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              @input="updateSlug"
            />
          </div>

          <!-- Slug -->
          <div>
            <label for="slug" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Slug *
            </label>
            <input
              id="slug"
              v-model="form.slug"
              type="text"
              required
              pattern="[a-z0-9-]+"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
            />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              URL-friendly identifier (lowercase, hyphens only)
            </p>
          </div>

          <!-- Excerpt -->
          <div>
            <label for="excerpt" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Excerpt *
            </label>
            <textarea
              id="excerpt"
              v-model="form.excerpt"
              required
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <!-- Tags -->
          <div>
            <label for="tags" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags
            </label>
            <input
              id="tags"
              v-model="tagsInput"
              type="text"
              placeholder="tag1, tag2, tag3"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              @blur="updateTags"
            />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Comma-separated list of tags
            </p>
            <div v-if="form.tags.length > 0" class="mt-2 flex flex-wrap gap-2">
              <span
                v-for="tag in form.tags"
                :key="tag"
                class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- Status -->
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status *
            </label>
            <select
              id="status"
              v-model="form.status"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <!-- Content Markdown -->
          <div>
            <label for="contentMarkdown" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content (Markdown) *
              <span v-if="contentType === 'writing'" class="text-xs text-gray-500 dark:text-gray-400 ml-2">
                (Longer format for writings)
              </span>
            </label>
            <textarea
              id="contentMarkdown"
              v-model="form.contentMarkdown"
              required
              :rows="contentType === 'writing' ? 30 : 20"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
            />
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-4 pt-4">
            <button
              type="submit"
              :disabled="saving"
              :class="contentType === 'writing' ? 'bg-purple-800 hover:bg-purple-700' : 'bg-primary-800 hover:bg-primary-700'"
              class="px-6 py-2 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="!saving">{{ isEdit ? (contentType === 'writing' ? 'Update Writing' : 'Update Post') : (contentType === 'writing' ? 'Create Writing' : 'Create Post') }}</span>
              <span v-else>Saving...</span>
            </button>
            <router-link
              to="/admin"
              class="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </router-link>
          </div>
        </div>

        <!-- Right column: Preview -->
        <div class="space-y-6">
          <div class="sticky top-8">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Preview
            </h3>
            <div class="border border-gray-300 dark:border-gray-600 rounded-md p-6 bg-white dark:bg-gray-800 min-h-[400px]">
              <div v-if="form.title" class="mb-4">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {{ form.title }}
                </h1>
                <div v-if="form.excerpt" class="text-gray-600 dark:text-gray-400 mb-4">
                  {{ form.excerpt }}
                </div>
                <div v-if="form.tags.length > 0" class="flex flex-wrap gap-2 mb-4">
                  <span
                    v-for="tag in form.tags"
                    :key="tag"
                    class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                  >
                    {{ tag }}
                  </span>
                </div>
                <hr class="my-4 border-gray-300 dark:border-gray-600" />
              </div>
              <MarkdownRenderer :content="form.contentMarkdown || '*Start typing to see preview...*'" />
            </div>
          </div>
        </div>
      </div>
    </form>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AdminLayout from '@/components/AdminLayout.vue'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'

const router = useRouter()
const route = useRoute()

const isEdit = computed(() => !!route.params.id)
const contentType = computed(() => {
  // Check query param first (for new items)
  if (route.query.type === 'writing' || route.query.type === 'blog') {
    return route.query.type
  }
  // For editing, we'll determine from the loaded data
  return currentType.value || 'blog'
})
const currentType = ref<'blog' | 'writing'>('blog')

const loading = ref(false)
const saving = ref(false)
const error = ref('')

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
    // Try to determine type from query param or try both endpoints
    const typeFromQuery = route.query.type as string
    let response, data

    if (typeFromQuery === 'writing') {
      response = await fetch(`/api/admin/writings/${route.params.id}`, {
        credentials: 'include',
      })
      data = await response.json()
      if (response.ok && data.ok) {
        currentType.value = 'writing'
      }
    } else if (typeFromQuery === 'blog') {
      response = await fetch(`/api/admin/blog/posts/${route.params.id}`, {
        credentials: 'include',
      })
      data = await response.json()
      if (response.ok && data.ok) {
        currentType.value = 'blog'
      }
    } else {
      // Try blog first, then writing
      response = await fetch(`/api/admin/blog/posts/${route.params.id}`, {
        credentials: 'include',
      })
      data = await response.json()
      if (response.ok && data.ok) {
        currentType.value = 'blog'
      } else {
        response = await fetch(`/api/admin/writings/${route.params.id}`, {
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

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        ...form.value,
        tags: form.value.tags,
      }),
    })

    const data = await response.json()

    if (!response.ok || !data.ok) {
      error.value = data.error || `Failed to save ${type === 'writing' ? 'writing' : 'post'}`
      saving.value = false
      return
    }

    // Redirect to list
    router.push('/admin')
  } catch (err) {
    console.error('Error saving content:', err)
    error.value = 'An error occurred while saving'
    saving.value = false
  }
}

onMounted(() => {
  loadPost()
})
</script>

