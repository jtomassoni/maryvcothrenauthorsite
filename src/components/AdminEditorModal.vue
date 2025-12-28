<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-70 p-4"
    @click.self="handleClose"
  >
    <div
      class="bg-white dark:bg-slate-900 rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col"
    >
      <!-- Modal Header -->
      <div
        class="px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between flex-shrink-0 bg-gradient-to-r from-gray-50 to-white dark:from-slate-800 dark:to-slate-900"
      >
        <div>
          <h2
            class="text-2xl font-semibold text-gray-900 dark:text-slate-100 mb-1"
          >
            {{ isEdit ? 'Edit Writing' : 'New Writing' }}
          </h2>
          <p class="text-sm text-gray-600 dark:text-slate-400">
            {{ isEdit ? 'Update your writing' : 'Create a new writing entry' }}
          </p>
        </div>
        <button
          @click="handleClose"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Modal Content -->
      <div class="flex-1 overflow-hidden p-6 flex flex-col min-h-0">
        <div v-if="loading" class="text-center py-12">
          <p class="text-gray-600 dark:text-slate-300">Loading...</p>
        </div>

        <form
          v-else
          @submit.prevent="handleSubmit"
          class="flex-1 flex flex-col min-h-0"
        >
          <!-- Error message -->
          <div
            v-if="error"
            class="rounded-md bg-red-50 dark:bg-red-900/20 p-3 border border-red-200 dark:border-red-800 mb-4"
          >
            <div class="flex items-start gap-2">
              <svg
                class="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div class="flex-1">
                <p
                  class="text-sm font-medium text-red-800 dark:text-red-200 mb-1"
                >
                  Error
                </p>
                <p
                  class="text-sm text-red-700 dark:text-red-300 whitespace-pre-wrap"
                >
                  {{ error }}
                </p>
              </div>
            </div>
          </div>

          <div
            class="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0"
            style="grid-template-rows: 1fr; max-height: 100%"
          >
            <!-- Left column: Form inputs -->
            <div
              class="space-y-3 flex flex-col min-h-0 overflow-y-auto overflow-x-visible pl-1 pr-2"
            >
              <!-- Title -->
              <div>
                <label
                  for="title"
                  class="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1"
                >
                  Title <span class="text-red-500 dark:text-red-400">*</span>
                </label>
                <input
                  id="title"
                  v-model="form.title"
                  type="text"
                  required
                  placeholder="e.g., Reflections on Night Shift Nursing"
                  class="w-full px-3 py-1.5 border rounded-md bg-white text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-1 focus:border-transparent text-sm dark:bg-slate-800 placeholder-gray-400 dark:placeholder-slate-500"
                  :class="
                    fieldErrors.title
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-slate-600'
                  "
                  @input="handleTitleChange"
                  @blur="validateTitle"
                />
                <div
                  v-if="fieldErrors.title"
                  class="mt-1 text-xs text-red-600 dark:text-red-400"
                  role="alert"
                >
                  {{ fieldErrors.title }}
                </div>
              </div>

              <!-- Slug -->
              <div>
                <label
                  for="slug"
                  class="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1"
                >
                  Slug <span class="text-red-500 dark:text-red-400">*</span>
                </label>
                <input
                  id="slug"
                  v-model="form.slug"
                  type="text"
                  required
                  pattern="[a-z0-9-]+"
                  class="w-full px-3 py-1.5 border rounded-md bg-white text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-1 focus:border-transparent font-mono text-sm dark:bg-slate-800"
                  :class="
                    fieldErrors.slug
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-slate-600'
                  "
                  @input="validateSlug"
                  @blur="validateSlug"
                />
                <p class="mt-0.5 text-xs text-gray-500 dark:text-slate-400">
                  URL-friendly identifier (lowercase, hyphens only)
                </p>
                <div
                  v-if="fieldErrors.slug"
                  class="mt-1 text-xs text-red-600 dark:text-red-400"
                  role="alert"
                >
                  {{ fieldErrors.slug }}
                </div>
              </div>

              <!-- Excerpt -->
              <div>
                <label
                  for="excerpt"
                  class="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1"
                >
                  Excerpt <span class="text-red-500 dark:text-red-400">*</span>
                </label>
                <input
                  id="excerpt"
                  v-model="form.excerpt"
                  type="text"
                  required
                  placeholder="A brief summary of your writing..."
                  class="w-full px-3 py-1.5 border rounded-md bg-white text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-1 focus:border-transparent text-sm dark:bg-slate-800 placeholder-gray-400 dark:placeholder-slate-500"
                  :class="
                    fieldErrors.excerpt
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-slate-600'
                  "
                  @input="validateExcerpt"
                  @blur="validateExcerpt"
                />
                <div
                  v-if="fieldErrors.excerpt"
                  class="mt-1 text-xs text-red-600 dark:text-red-400"
                  role="alert"
                >
                  {{ fieldErrors.excerpt }}
                </div>
              </div>

              <!-- Tags -->
              <div class="py-1">
                <label
                  for="tags"
                  class="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1"
                >
                  Tags
                </label>

                <div class="flex gap-2 mb-2">
                  <input
                    id="newTag"
                    v-model="newTagInput"
                    type="text"
                    placeholder="Add a tag and press Enter"
                    class="flex-1 px-3 py-1.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 rounded-md bg-white text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-1 focus:border-transparent text-sm"
                    @keyup.enter.prevent="addNewTag"
                  />
                  <button
                    type="button"
                    @click="addNewTag"
                    class="px-3 py-1.5 text-sm bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-500 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    Add Tag
                  </button>
                </div>

                <div v-if="form.tags.length > 0" class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in form.tags"
                    :key="tag"
                    class="px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 rounded flex items-center gap-1"
                  >
                    {{ tag }}
                    <button
                      type="button"
                      @click="removeTag(tag)"
                      class="hover:text-primary-600 dark:hover:text-primary-300 focus:outline-none"
                      aria-label="Remove tag"
                    >
                      <svg
                        class="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </span>
                </div>
              </div>

              <!-- Status -->
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2"
                >
                  Status <span class="text-red-500 dark:text-red-400">*</span>
                </label>
                <div class="flex items-center gap-4">
                  <div class="flex items-center gap-2 w-20">
                    <svg
                      class="h-4 w-4 transition-all duration-300"
                      :class="
                        form.status === 'draft'
                          ? 'text-amber-500 opacity-100'
                          : 'text-amber-500 opacity-0'
                      "
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span
                      class="text-sm font-medium transition-colors"
                      :class="
                        form.status === 'draft'
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-gray-500 dark:text-slate-400'
                      "
                    >
                      Draft
                    </span>
                  </div>
                  <button
                    type="button"
                    @click="
                      form.status =
                        form.status === 'draft' ? 'published' : 'draft'
                    "
                    :class="[
                      'relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md hover:shadow-lg transform hover:scale-105',
                      form.status === 'published'
                        ? 'bg-gradient-to-r from-emerald-400 to-green-500 focus:ring-emerald-500'
                        : 'bg-gradient-to-r from-amber-400 to-orange-500 focus:ring-amber-500',
                    ]"
                    role="switch"
                    :aria-checked="form.status === 'published'"
                    aria-label="Toggle status"
                  >
                    <span
                      :class="[
                        'inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300',
                        form.status === 'published'
                          ? 'translate-x-8'
                          : 'translate-x-1',
                      ]"
                    />
                  </button>
                  <div class="flex items-center gap-2 w-24">
                    <svg
                      class="h-4 w-4 transition-all duration-300"
                      :class="
                        form.status === 'published'
                          ? 'text-emerald-500 opacity-100'
                          : 'text-emerald-500 opacity-0'
                      "
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span
                      class="text-sm font-medium transition-colors"
                      :class="
                        form.status === 'published'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-gray-500 dark:text-slate-400'
                      "
                    >
                      Published
                    </span>
                  </div>
                </div>
              </div>

              <!-- Content Markdown -->
              <div class="flex-1 flex flex-col min-h-0 pl-1 pb-4">
                <div class="flex items-center gap-2 mb-1">
                  <label
                    for="contentMarkdown"
                    class="block text-sm font-medium text-gray-700 dark:text-slate-200"
                  >
                    Content (Markdown)
                    <span class="text-red-500 dark:text-red-400">*</span>
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
                </div>
                <textarea
                  id="contentMarkdown"
                  v-model="form.contentMarkdown"
                  required
                  class="w-full flex-1 px-3 py-1.5 border rounded-md bg-white text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-1 focus:border-transparent font-mono text-sm resize-none dark:bg-slate-800"
                  :class="
                    fieldErrors.contentMarkdown
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-slate-600'
                  "
                  @input="validateContentMarkdown"
                  @blur="validateContentMarkdown"
                />
                <div
                  v-if="fieldErrors.contentMarkdown"
                  class="mt-1 text-xs text-red-600 dark:text-red-400"
                  role="alert"
                >
                  {{ fieldErrors.contentMarkdown }}
                </div>
              </div>
            </div>

            <!-- Right column: Preview -->
            <div class="flex flex-col flex-1 min-h-0">
              <h3
                class="text-base font-medium text-gray-900 dark:text-slate-100 mb-2 flex-shrink-0"
              >
                Preview
              </h3>
              <div
                class="border border-gray-300 dark:border-slate-700 rounded-md p-4 bg-white dark:bg-slate-900 shadow-sm dark:shadow-lg flex-1 overflow-y-auto min-h-0"
              >
                <div v-if="form.title" class="mb-3">
                  <h1
                    class="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2"
                  >
                    {{ form.title }}
                  </h1>
                  <div
                    v-if="form.excerpt"
                    class="text-sm text-gray-600 dark:text-slate-300 mb-3"
                  >
                    {{ form.excerpt }}
                  </div>
                  <div
                    v-if="form.tags.length > 0"
                    class="flex flex-wrap gap-2 mb-3"
                  >
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
                <MarkdownRenderer
                  :content="form.contentMarkdown || '*Share your story here.*'"
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- Modal Footer -->
      <div
        class="px-6 py-4 border-t border-gray-200 dark:border-slate-700 flex items-center justify-end gap-3 flex-shrink-0 bg-gray-50 dark:bg-slate-800/50"
      >
        <button
          @click="handleClose"
          class="px-5 py-2 text-sm font-medium border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 dark:bg-slate-800 transition-colors shadow-sm"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="handleSubmit"
          :disabled="saving || loading || !isFormValid"
          :class="[
            'px-5 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200',
            !isFormValid || saving || loading
              ? 'bg-purple-400 dark:bg-purple-500 opacity-50 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-500 shadow-md hover:shadow-lg',
          ]"
        >
          <span v-if="!saving">{{
            isEdit ? 'Update Writing' : 'Create Writing'
          }}</span>
          <span v-else>Saving...</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'

const props = defineProps<{
  isOpen: boolean
  editId?: string | null
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const isEdit = computed(() => !!props.editId)

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

const fieldErrors = ref({
  title: '',
  slug: '',
  excerpt: '',
  contentMarkdown: '',
})

const newTagInput = ref('')

const defaultMarkdown = `## Introduction

Share your nursing story, reflection, or experience here. This longer format allows you to explore your thoughts in depth and connect with readers on a deeper level.

### Your Experience

Write about your journey, the challenges you've faced, or the moments that have shaped you:

- **Patient care** experiences that moved you
- *Personal reflections* on your practice
- Lessons learned from difficult shifts
- Connections made with patients and colleagues

> "The best way to find yourself is to lose yourself in the service of others." - Mahatma Gandhi

---

### Reflection

Continue your narrative here. This is your space to be contemplative, honest, and authentic about your journey.`

const isFormValid = computed(() => {
  return !!(
    form.value.title?.trim() &&
    form.value.slug?.trim() &&
    form.value.excerpt?.trim() &&
    form.value.contentMarkdown?.trim() &&
    form.value.status &&
    !fieldErrors.value.title &&
    !fieldErrors.value.slug &&
    !fieldErrors.value.excerpt &&
    !fieldErrors.value.contentMarkdown
  )
})

const validateTitle = () => {
  fieldErrors.value.title = form.value.title?.trim() ? '' : 'Title is required'
}

const validateSlug = () => {
  if (!form.value.slug?.trim()) {
    fieldErrors.value.slug = 'Slug is required'
  } else if (!/^[a-z0-9-]+$/.test(form.value.slug)) {
    fieldErrors.value.slug =
      'Slug must contain only lowercase letters, numbers, and hyphens'
  } else {
    fieldErrors.value.slug = ''
  }
}

const validateExcerpt = () => {
  fieldErrors.value.excerpt = form.value.excerpt?.trim()
    ? ''
    : 'Excerpt is required'
}

const validateContentMarkdown = () => {
  fieldErrors.value.contentMarkdown = form.value.contentMarkdown?.trim()
    ? ''
    : 'Content is required'
}

const handleTitleChange = () => {
  if (!isEdit.value) {
    form.value.slug = form.value.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
  validateTitle()
  if (!isEdit.value) {
    validateSlug()
  }
}

const addNewTag = () => {
  const tag = newTagInput.value.trim()
  if (tag && !form.value.tags.includes(tag)) {
    form.value.tags.push(tag)
  }
  newTagInput.value = ''
}

const removeTag = (tag: string) => {
  form.value.tags = form.value.tags.filter((t) => t !== tag)
}

const resetForm = () => {
  form.value = {
    title: '',
    slug: '',
    excerpt: '',
    contentMarkdown: defaultMarkdown,
    tags: [],
    status: 'draft',
  }
  fieldErrors.value = {
    title: '',
    slug: '',
    excerpt: '',
    contentMarkdown: '',
  }
  newTagInput.value = ''
  error.value = ''
}

const loadWriting = async () => {
  if (!props.editId) {
    resetForm()
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

    const response = await fetch(`/api/admin/writings/${props.editId}`, {
      headers,
      credentials: 'include',
    })

    const contentType = response.headers.get('content-type') || ''
    let data: any = null
    if (contentType.includes('application/json')) {
      data = await response.json()
    } else {
      const text = await response.text()
      throw new Error(
        `Unexpected response (status ${response.status}): ${text.substring(0, 200)}`
      )
    }

    if (!response.ok || !data?.ok) {
      error.value = data?.error || data?.message || 'Failed to load writing'
      return
    }

    const writing = data.writing
    form.value = {
      title: writing.title,
      slug: writing.slug,
      excerpt: writing.excerpt,
      contentMarkdown: writing.contentMarkdown,
      tags: writing.tags || [],
      status: writing.status,
    }
  } catch (err) {
    console.error('Error loading writing:', err)
    error.value =
      err instanceof Error
        ? err.message
        : 'An error occurred while loading the writing'
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  saving.value = true
  error.value = ''

  try {
    const token = localStorage.getItem('auth_token')
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const method = isEdit.value ? 'PUT' : 'POST'
    const url = isEdit.value
      ? `/api/admin/writings/${props.editId}`
      : '/api/admin/writings'

    const response = await fetch(url, {
      method,
      headers,
      credentials: 'include',
      body: JSON.stringify(form.value),
    })

    const contentType = response.headers.get('content-type') || ''
    let data: any = null
    if (contentType.includes('application/json')) {
      data = await response.json()
    } else {
      const text = await response.text()
      error.value = text || `Server error: ${response.status}`
      saving.value = false
      return
    }

    if (!response.ok || !data?.ok) {
      error.value = data?.error || data?.message || `Failed to save writing`
      saving.value = false
      return
    }

    emit('saved')
    handleClose()
  } catch (err) {
    console.error('Error saving writing:', err)
    error.value =
      err instanceof Error ? err.message : 'An error occurred while saving'
    saving.value = false
  }
}

const handleClose = () => {
  emit('close')
}

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      loadWriting()
      if (!isEdit.value && !form.value.contentMarkdown) {
        form.value.contentMarkdown = defaultMarkdown
      }
    } else {
      resetForm()
    }
  }
)
</script>
