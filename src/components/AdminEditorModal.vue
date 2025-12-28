<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-70 p-4"
    @click.self="handleClose"
  >
    <div class="bg-white dark:bg-slate-900 rounded-lg shadow-xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-slate-100">
            {{ isEdit ? (contentType === 'writing' ? 'Edit Writing' : 'Edit Post') : (contentType === 'writing' ? 'New Writing' : 'New Post') }}
          </h2>
          <p class="text-xs text-gray-600 dark:text-slate-400 mt-0.5">
            {{ isEdit ? (contentType === 'writing' ? 'Update your writing' : 'Update your blog post') : (contentType === 'writing' ? 'Create a new writing (longer format)' : 'Create a new blog post (SEO & engagement)') }}
          </p>
        </div>
        <button
          @click="handleClose"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded p-1"
          aria-label="Close modal"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Modal Content -->
      <div class="flex-1 overflow-hidden p-6 flex flex-col min-h-0">
        <div v-if="loading" class="text-center py-12">
          <p class="text-gray-600 dark:text-slate-300">Loading...</p>
        </div>

        <form v-else @submit.prevent="handleSubmit" class="flex-1 flex flex-col min-h-0">
          <!-- Error message -->
          <div v-if="error" class="rounded-md bg-red-50 dark:bg-red-900/20 p-3">
            <p class="text-sm text-red-800 dark:text-red-200">{{ error }}</p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0" style="grid-template-rows: 1fr; max-height: 100%;">
            <!-- Left column: Form inputs -->
            <div class="space-y-3 flex flex-col min-h-0 overflow-hidden">
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
                <label for="slug" class="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">
                  Slug *
                </label>
                <input
                  id="slug"
                  v-model="form.slug"
                  type="text"
                  required
                  pattern="[a-z0-9-]+"
                  class="w-full px-3 py-1.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 rounded-md bg-white text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent font-mono text-sm"
                />
                <p class="mt-0.5 text-xs text-gray-500 dark:text-slate-400">
                  URL-friendly identifier (lowercase, hyphens only)
                </p>
              </div>

              <!-- Excerpt -->
              <div>
                <label for="excerpt" class="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">
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
                <label for="tags" class="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">
                  Tags
                </label>
                <input
                  id="tags"
                  v-model="tagsInput"
                  type="text"
                  placeholder="tag1, tag2, tag3"
                  class="w-full px-3 py-1.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 rounded-md bg-white text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent text-sm"
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
                <label for="status" class="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">
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
              <div class="flex-1 flex flex-col min-h-0">
                <div class="flex items-center gap-2 mb-1">
                  <label for="contentMarkdown" class="block text-sm font-medium text-gray-700 dark:text-slate-200">
                    Content (Markdown) *
                  </label>
                  <a
                    href="/markdown-help"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                    title="Markdown formatting help (opens in new tab)"
                  >
                    Markdown hints
                  </a>
                  <span v-if="contentType === 'writing'" class="text-xs text-gray-500 dark:text-slate-400">
                    (Longer format)
                  </span>
                </div>
                <textarea
                  id="contentMarkdown"
                  v-model="form.contentMarkdown"
                  required
                  class="w-full flex-1 px-3 py-1.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 rounded-md bg-white text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent font-mono text-sm resize-none"
                />
              </div>
            </div>

            <!-- Right column: Preview -->
            <div class="flex flex-col flex-1 min-h-0">
              <h3 class="text-base font-medium text-gray-900 dark:text-slate-100 mb-2 flex-shrink-0">
                Preview
              </h3>
              <div class="border border-gray-300 dark:border-slate-700 rounded-md p-4 bg-white dark:bg-slate-900 shadow-sm dark:shadow-lg flex-1 overflow-y-auto min-h-0">
                <div v-if="form.title" class="mb-3">
                  <h1 class="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">
                    {{ form.title }}
                  </h1>
                  <div v-if="form.excerpt" class="text-sm text-gray-600 dark:text-slate-300 mb-3">
                    {{ form.excerpt }}
                  </div>
                  <div v-if="form.tags.length > 0" class="flex flex-wrap gap-2 mb-3">
                    <span
                      v-for="tag in form.tags"
                      :key="tag"
                      class="px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 dark:border dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded"
                    >
                      {{ tag }}
                    </span>
                  </div>
                  <hr class="my-3 border-gray-300 dark:border-slate-700" />
                </div>
                <MarkdownRenderer :content="form.contentMarkdown || '*Start typing to see preview...*'" />
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-slate-700 flex items-center justify-end gap-3 flex-shrink-0">
        <button
          @click="handleClose"
          class="px-4 py-1.5 text-sm border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded-md hover:bg-gray-50 dark:hover:bg-slate-800 dark:bg-slate-900 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="handleSubmit"
          :disabled="saving || loading"
          :class="contentType === 'writing' ? 'bg-purple-800 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600' : 'bg-primary-800 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600'"
          class="px-4 py-1.5 text-sm text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm dark:shadow-md"
        >
          <span v-if="!saving">{{ isEdit ? (contentType === 'writing' ? 'Update Writing' : 'Update Post') : (contentType === 'writing' ? 'Create Writing' : 'Create Post') }}</span>
          <span v-else>Saving...</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'

const props = defineProps<{
  isOpen: boolean
  editId?: string | null
  contentType?: 'blog' | 'writing'
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const router = useRouter()

const isEdit = computed(() => !!props.editId)
const currentType = ref<'blog' | 'writing'>(props.contentType || 'blog')
const contentType = computed(() => props.contentType || currentType.value)

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

const getDefaultMarkdown = (type: 'blog' | 'writing') => {
  if (type === 'writing') {
    return `## Introduction

Start your writing here. This is a longer format piece where you can explore ideas in depth.

### Section Heading

You can use markdown formatting:

- **Bold text** for emphasis
- *Italic text* for subtle emphasis
- Lists to organize thoughts
- [Links](https://example.com) to reference sources

> Blockquotes are great for highlighting important passages or quotes.

\`\`\`
Code blocks can be used for examples
or technical content
\`\`\`

---

Continue writing your thoughts here. This space is for longer, more contemplative pieces.`
  } else {
    return `## Introduction

Start your blog post here. This format is optimized for SEO and engagement.

### Key Points

You can use markdown to format your content:

- **Bold** for important terms
- *Italic* for emphasis
- Lists to organize information
- [Links](https://example.com) to external resources

> Use blockquotes to highlight important information or quotes.

\`Inline code\` can be used for technical terms.

---

### Conclusion

Wrap up your post with a clear conclusion that ties everything together.`
  }
}

const loadPost = async () => {
  if (!isEdit.value || !props.editId) {
    if (props.contentType) {
      currentType.value = props.contentType
    }
    // Set default markdown content for new items
    if (!form.value.contentMarkdown) {
      form.value.contentMarkdown = getDefaultMarkdown(contentType.value)
    }
    return
  }

  loading.value = true
  error.value = ''

  try {
    const token = localStorage.getItem('auth_token')
    const headers: Record<string, string> = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const typeFromQuery = contentType.value
    let response, data

    if (typeFromQuery === 'writing') {
      response = await fetch(`/api/admin/writings/${props.editId}`, {
        headers,
        credentials: 'include',
      })
      data = await response.json()
      if (response.ok && data.ok) {
        currentType.value = 'writing'
      }
    } else {
      response = await fetch(`/api/admin/blog/posts/${props.editId}`, {
        headers,
        credentials: 'include',
      })
      data = await response.json()
      if (response.ok && data.ok) {
        currentType.value = 'blog'
      } else {
        // Try writing if blog fails
        response = await fetch(`/api/admin/writings/${props.editId}`, {
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
          ? `/api/admin/writings/${props.editId}`
          : `/api/admin/blog/posts/${props.editId}`)
      : (type === 'writing'
          ? '/api/admin/writings'
          : '/api/admin/blog/posts')

    const method = isEdit.value ? 'PUT' : 'POST'

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

    emit('saved')
    handleClose()
  } catch (err) {
    console.error('Error saving content:', err)
    error.value = err instanceof Error ? err.message : 'An error occurred while saving'
    saving.value = false
  }
}

const handleClose = () => {
  emit('close')
}

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) {
    handleClose()
  }
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    loadPost()
    window.addEventListener('keydown', handleEscape)
    // Set default markdown if creating new item
    if (!isEdit.value && !form.value.contentMarkdown) {
      form.value.contentMarkdown = getDefaultMarkdown(contentType.value)
    }
  } else {
    window.removeEventListener('keydown', handleEscape)
    // Reset form when closing
    form.value = {
      title: '',
      slug: '',
      excerpt: '',
      contentMarkdown: '',
      tags: [],
      status: 'draft',
    }
    tagsInput.value = ''
    error.value = ''
  }
})

watch(() => [props.contentType, props.isOpen], ([newType, isOpen]) => {
  if (isOpen && !isEdit.value && newType) {
    // Update default content when contentType changes
    if (!form.value.contentMarkdown || form.value.contentMarkdown === getDefaultMarkdown(newType === 'writing' ? 'blog' : 'writing')) {
      form.value.contentMarkdown = getDefaultMarkdown(newType)
    }
  }
})

onMounted(() => {
  if (props.isOpen) {
    loadPost()
    window.addEventListener('keydown', handleEscape)
    // Set default markdown if creating new item
    if (!isEdit.value && !form.value.contentMarkdown) {
      form.value.contentMarkdown = getDefaultMarkdown(contentType.value)
    }
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscape)
})
</script>

