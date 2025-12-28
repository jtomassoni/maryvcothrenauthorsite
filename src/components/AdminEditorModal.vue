<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-70 p-4"
    @click.self="handleClose"
  >
    <div class="bg-white dark:bg-slate-900 rounded-lg shadow-xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
      <!-- Modal Header -->
      <div class="px-6 py-5 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between flex-shrink-0 bg-gradient-to-r from-gray-50 to-white dark:from-slate-800 dark:to-slate-900">
        <div>
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-slate-100 mb-1">
            {{ isEdit ? (contentType === 'writing' ? 'Edit Writing' : 'Edit Post') : (contentType === 'writing' ? 'New Writing' : 'New Post') }}
          </h2>
          <p class="text-sm text-gray-600 dark:text-slate-400">
            {{ isEdit ? (contentType === 'writing' ? 'Update your writing' : 'Update your blog post') : (contentType === 'writing' ? 'Create a new writing (longer format)' : 'Create a new blog post (SEO & engagement)') }}
          </p>
        </div>
        <button
          @click="handleClose"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div v-if="error" class="rounded-md bg-red-50 dark:bg-red-900/20 p-3 border border-red-200 dark:border-red-800">
            <div class="flex items-start gap-2">
              <svg class="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div class="flex-1">
                <p class="text-sm font-medium text-red-800 dark:text-red-200 mb-1">Error</p>
                <p class="text-sm text-red-700 dark:text-red-300 whitespace-pre-wrap">{{ error }}</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0" style="grid-template-rows: 1fr; max-height: 100%;">
            <!-- Left column: Form inputs -->
            <div class="space-y-3 flex flex-col min-h-0 overflow-y-auto overflow-x-visible pl-1 pr-2">
              <!-- Content Type Toggle -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                  Content Type <span class="text-red-500 dark:text-red-400">*</span>
                </label>
                <div class="flex items-center gap-4">
                  <div class="flex items-center gap-2 w-20">
                    <svg class="h-4 w-4 transition-all duration-300" :class="contentType === 'blog' ? 'text-cyan-500 opacity-100' : 'text-cyan-500 opacity-0'" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                    </svg>
                    <span 
                      class="text-sm font-medium transition-colors"
                      :class="contentType === 'blog' 
                        ? 'text-cyan-600 dark:text-cyan-400' 
                        : 'text-gray-500 dark:text-slate-400'"
                    >
                      Blog
                    </span>
                  </div>
                  <button
                    type="button"
                    @click="toggleContentType"
                    :class="[
                      'relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md hover:shadow-lg transform hover:scale-105',
                      contentType === 'writing' 
                        ? 'bg-gradient-to-r from-purple-400 to-purple-500 focus:ring-purple-500' 
                        : 'bg-gradient-to-r from-cyan-400 to-cyan-500 focus:ring-cyan-500'
                    ]"
                    role="switch"
                    :aria-checked="contentType === 'writing'"
                    aria-label="Toggle content type"
                  >
                    <span
                      :class="[
                        'inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300',
                        contentType === 'writing' ? 'translate-x-8' : 'translate-x-1'
                      ]"
                    />
                  </button>
                  <div class="flex items-center gap-2 w-24">
                    <svg class="h-4 w-4 transition-all duration-300" :class="contentType === 'writing' ? 'text-purple-500 opacity-100' : 'text-purple-500 opacity-0'" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <span 
                      class="text-sm font-medium transition-colors"
                      :class="contentType === 'writing' 
                        ? 'text-purple-600 dark:text-purple-400' 
                        : 'text-gray-500 dark:text-slate-400'"
                    >
                      Writing
                    </span>
                  </div>
                </div>
              </div>

              <!-- Title -->
              <div>
                <label for="title" class="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">
                  Title <span class="text-red-500 dark:text-red-400">*</span>
                </label>
                <input
                  id="title"
                  v-model="form.title"
                  type="text"
                  required
                  placeholder="e.g., Reflections on Night Shift Nursing"
                  class="w-full px-3 py-1.5 border rounded-md bg-white text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-1 focus:border-transparent text-sm dark:bg-slate-800 placeholder-gray-400 dark:placeholder-slate-500"
                  :class="fieldErrors.title ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-slate-600'"
                  @input="updateSlug"
                  @blur="validateTitle"
                />
                <div v-if="fieldErrors.title" class="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
                  {{ fieldErrors.title }}
                </div>
              </div>

              <!-- Slug -->
              <div>
                <label for="slug" class="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">
                  Slug <span class="text-red-500 dark:text-red-400">*</span>
                </label>
                <input
                  id="slug"
                  v-model="form.slug"
                  type="text"
                  required
                  pattern="[a-z0-9-]+"
                  class="w-full px-3 py-1.5 border rounded-md bg-white text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-1 focus:border-transparent font-mono text-sm dark:bg-slate-800"
                  :class="fieldErrors.slug ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-slate-600'"
                  @input="validateSlug"
                  @blur="validateSlug"
                />
                <p class="mt-0.5 text-xs text-gray-500 dark:text-slate-400">
                  URL-friendly identifier (lowercase, hyphens only)
                </p>
                <div v-if="fieldErrors.slug" class="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
                  {{ fieldErrors.slug }}
                </div>
              </div>

              <!-- Excerpt -->
              <div>
                <label for="excerpt" class="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">
                  Excerpt <span class="text-red-500 dark:text-red-400">*</span>
                </label>
                <input
                  id="excerpt"
                  v-model="form.excerpt"
                  type="text"
                  required
                  placeholder="A brief summary of your nursing experience or insight..."
                  class="w-full px-3 py-1.5 border rounded-md bg-white text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-1 focus:border-transparent text-sm dark:bg-slate-800 placeholder-gray-400 dark:placeholder-slate-500"
                  :class="fieldErrors.excerpt ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-slate-600'"
                  @input="validateExcerpt"
                  @blur="validateExcerpt"
                />
                <div v-if="fieldErrors.excerpt" class="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
                  {{ fieldErrors.excerpt }}
                </div>
              </div>

              <!-- Tags -->
              <div class="py-1">
                <label for="tags" class="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">
                  Tags
                </label>
                
                <!-- New Tag Input -->
                <div class="flex gap-2 mb-2">
                  <input
                    id="newTag"
                    v-model="newTagInput"
                    type="text"
                    placeholder="e.g., ICU, Emergency, Mental Health"
                    class="flex-1 px-3 py-1.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 rounded-md bg-white text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-1 focus:border-transparent text-sm"
                    @keyup.enter="addNewTag"
                  />
                  <button
                    type="button"
                    @click="addNewTag"
                    class="px-3 py-1.5 text-sm bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-500 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    Add Tag
                  </button>
                </div>

                <!-- Selected Tags -->
                <div v-if="form.tags.length > 0" class="mb-2">
                  <p class="text-xs text-gray-500 dark:text-slate-400 mb-1">Selected tags:</p>
                  <div class="flex flex-wrap gap-2">
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
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  </div>
                </div>

                <!-- Pre-existing Tags -->
                <div class="mt-2">
                  <div class="flex items-center justify-between mb-2">
                    <p class="text-xs text-gray-500 dark:text-slate-400">Pre-existing tags:</p>
                    <button
                      v-if="availableTags.length > 12"
                      type="button"
                      @click="showAllTags = !showAllTags"
                      class="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 focus:outline-none"
                    >
                      {{ showAllTags ? 'Show Less' : `Show All (${availableTags.length})` }}
                    </button>
                  </div>
                  <div class="flex flex-wrap gap-2 max-h-32 overflow-y-auto py-1" :class="{ 'max-h-none': showAllTags }">
                    <button
                      v-for="tag in displayedTags"
                      :key="tag"
                      type="button"
                      @click="toggleTag(tag)"
                      :class="[
                        'px-2 py-1 text-xs rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500',
                        isTagSelected(tag)
                          ? 'bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-slate-200'
                          : 'bg-gray-100 dark:bg-slate-700 dark:border dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                      ]"
                    >
                      {{ tag }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Status -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                  Status <span class="text-red-500 dark:text-red-400">*</span>
                </label>
                <div class="flex items-center gap-4">
                  <div class="flex items-center gap-2 w-20">
                    <svg class="h-4 w-4 transition-all duration-300" :class="form.status === 'draft' ? 'text-amber-500 opacity-100' : 'text-amber-500 opacity-0'" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                    </svg>
                    <span 
                      class="text-sm font-medium transition-colors"
                      :class="form.status === 'draft' 
                        ? 'text-amber-600 dark:text-amber-400' 
                        : 'text-gray-500 dark:text-slate-400'"
                    >
                      Draft
                    </span>
                  </div>
                  <button
                    type="button"
                    @click="form.status = form.status === 'draft' ? 'published' : 'draft'"
                    :class="[
                      'relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md hover:shadow-lg transform hover:scale-105',
                      form.status === 'published' 
                        ? 'bg-gradient-to-r from-emerald-400 to-green-500 focus:ring-emerald-500' 
                        : 'bg-gradient-to-r from-amber-400 to-orange-500 focus:ring-amber-500'
                    ]"
                    role="switch"
                    :aria-checked="form.status === 'published'"
                    aria-label="Toggle status"
                  >
                    <span
                      :class="[
                        'inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300',
                        form.status === 'published' ? 'translate-x-8' : 'translate-x-1'
                      ]"
                    />
                  </button>
                  <div class="flex items-center gap-2 w-24">
                    <svg class="h-4 w-4 transition-all duration-300" :class="form.status === 'published' ? 'text-emerald-500 opacity-100' : 'text-emerald-500 opacity-0'" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <span 
                      class="text-sm font-medium transition-colors"
                      :class="form.status === 'published' 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : 'text-gray-500 dark:text-slate-400'"
                    >
                      Published
                    </span>
                  </div>
                </div>
              </div>

              <!-- Content Markdown -->
              <div class="flex-1 flex flex-col min-h-0 pl-1 pb-4">
                <div class="flex items-center gap-2 mb-1">
                  <label for="contentMarkdown" class="block text-sm font-medium text-gray-700 dark:text-slate-200">
                    Content (Markdown) <span class="text-red-500 dark:text-red-400">*</span>
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
                  class="w-full flex-1 px-3 py-1.5 border rounded-md bg-white text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-1 focus:border-transparent font-mono text-sm resize-none dark:bg-slate-800"
                  :class="fieldErrors.contentMarkdown ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-slate-600'"
                  @input="validateContentMarkdown"
                  @blur="validateContentMarkdown"
                />
                <div v-if="fieldErrors.contentMarkdown" class="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
                  {{ fieldErrors.contentMarkdown }}
                </div>
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
                <MarkdownRenderer :content="form.contentMarkdown || '*Share your nursing story, insights, or reflections here. Your words matter.*'" />
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-slate-700 flex items-center justify-end gap-3 flex-shrink-0 bg-gray-50 dark:bg-slate-800/50">
        <button
          @click="handleClose"
          class="px-5 py-2 text-sm font-medium border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 dark:bg-slate-800 transition-colors shadow-sm"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="handleSubmit"
          :disabled="saving || loading || !canSubmit"
          :class="[
            contentType === 'writing' 
              ? 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-500' 
              : 'bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-500',
            (!canSubmit || saving || loading) 
              ? 'opacity-50 cursor-not-allowed' 
              : 'shadow-md hover:shadow-lg'
          ]"
          class="px-5 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200"
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

const isEdit = computed(() => !!props.editId)
const currentType = ref<'blog' | 'writing'>(props.contentType || 'blog')
const contentType = computed(() => currentType.value)

const toggleContentType = () => {
  if (isEdit.value) {
    // When editing, warn user that changing type will require saving to a different endpoint
    // For now, just allow the toggle - the save will handle it
    currentType.value = currentType.value === 'blog' ? 'writing' : 'blog'
  } else {
    // For new items, just toggle and update default content
    currentType.value = currentType.value === 'blog' ? 'writing' : 'blog'
    // Update default markdown content when type changes
    if (!form.value.contentMarkdown || form.value.contentMarkdown === getDefaultMarkdown(currentType.value === 'blog' ? 'writing' : 'blog')) {
      form.value.contentMarkdown = getDefaultMarkdown(currentType.value)
    }
  }
}

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

const originalForm = ref({
  title: '',
  slug: '',
  excerpt: '',
  contentMarkdown: '',
  tags: [] as string[],
  status: 'draft',
})

const tagsInput = ref('')
const newTagInput = ref('')
const showAllTags = ref(false)

// Pre-existing tags relevant to the author's themes
const availableTags = ref([
  'Writing', 'Nursing', 'Travel', 'Food', 'Adventure', 'Mental Health',
  'Personal Growth', 'Literature', 'Memoir', 'Fiction', 'Non-fiction',
  'Healthcare', 'Education', 'Wellness', 'Reflection', 'Storytelling',
  'Creative Writing', 'Professional Development', 'Life Lessons', 'Inspiration',
  'Pandemic', 'PTSD', 'Anxiety', 'Depression', 'Self-care', 'Resilience',
  'Rock Climbing', 'Dogs', 'Pet Care', 'Community', 'Connection', 'Journey'
])

const displayedTags = computed(() => {
  if (showAllTags.value) {
    return availableTags.value
  }
  return availableTags.value.slice(0, 12)
})

const isTagSelected = (tag: string) => {
  return form.value.tags.includes(tag)
}

const toggleTag = (tag: string) => {
  const index = form.value.tags.indexOf(tag)
  if (index > -1) {
    form.value.tags.splice(index, 1)
  } else {
    form.value.tags.push(tag)
  }
  updateTagsInput()
}

const addNewTag = () => {
  const tag = newTagInput.value.trim()
  if (tag && !form.value.tags.includes(tag)) {
    form.value.tags.push(tag)
    // Add to available tags if it's new
    if (!availableTags.value.includes(tag)) {
      availableTags.value.push(tag)
      // Sort tags alphabetically
      availableTags.value.sort()
    }
    newTagInput.value = ''
    updateTagsInput()
  }
}

const removeTag = (tag: string) => {
  const index = form.value.tags.indexOf(tag)
  if (index > -1) {
    form.value.tags.splice(index, 1)
    updateTagsInput()
  }
}

const updateTagsInput = () => {
  tagsInput.value = form.value.tags.join(', ')
}

const fieldErrors = ref({
  title: '',
  slug: '',
  excerpt: '',
  contentMarkdown: ''
})

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

const isDirty = computed(() => {
  if (!isEdit.value) return false
  
  return (
    form.value.title !== originalForm.value.title ||
    form.value.slug !== originalForm.value.slug ||
    form.value.excerpt !== originalForm.value.excerpt ||
    form.value.contentMarkdown !== originalForm.value.contentMarkdown ||
    form.value.status !== originalForm.value.status ||
    JSON.stringify([...form.value.tags].sort()) !== JSON.stringify([...originalForm.value.tags].sort())
  )
})

const canSubmit = computed(() => {
  if (!isFormValid.value) return false
  if (isEdit.value) {
    return isDirty.value
  }
  return true
})

const validateTitle = () => {
  if (!form.value.title?.trim()) {
    fieldErrors.value.title = 'Title is required'
  } else {
    fieldErrors.value.title = ''
  }
}

const validateSlug = () => {
  if (!form.value.slug?.trim()) {
    fieldErrors.value.slug = 'Slug is required'
  } else if (!/^[a-z0-9-]+$/.test(form.value.slug)) {
    fieldErrors.value.slug = 'Slug must contain only lowercase letters, numbers, and hyphens'
  } else {
    fieldErrors.value.slug = ''
  }
}

const validateExcerpt = () => {
  if (!form.value.excerpt?.trim()) {
    fieldErrors.value.excerpt = 'Excerpt is required'
  } else {
    fieldErrors.value.excerpt = ''
  }
}

const validateContentMarkdown = () => {
  if (!form.value.contentMarkdown?.trim()) {
    fieldErrors.value.contentMarkdown = 'Content is required'
  } else {
    fieldErrors.value.contentMarkdown = ''
  }
}

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
  validateTitle()
  if (!isEdit.value) {
    validateSlug()
  }
}

// Initialize tags input when form loads
watch(() => form.value.tags, () => {
  updateTagsInput()
}, { immediate: true })

const getDefaultMarkdown = (type: 'blog' | 'writing') => {
  if (type === 'writing') {
    return `## Introduction

Share your nursing story, reflection, or experience here. This longer format allows you to explore your thoughts in depth and connect with readers on a deeper level.

### Your Experience

Write about your nursing journey, the challenges you've faced, or the moments that have shaped you:

- **Patient care** experiences that moved you
- *Personal reflections* on your nursing practice
- Lessons learned from difficult shifts
- Connections made with patients and colleagues

> "The best way to find yourself is to lose yourself in the service of others." - Mahatma Gandhi

Use this space to explore your thoughts, share your insights, and tell the stories that matter to you.

---

### Reflection

Continue your narrative here. This is your space to be contemplative, honest, and authentic about your nursing journey.`
  } else {
    return `## Introduction

Share your nursing insights, tips, or experiences here. This format helps readers quickly find valuable information.

### Key Takeaways

Use markdown to make your content engaging:

- **Important nursing concepts** or protocols
- *Personal anecdotes* from your shifts
- Practical tips for fellow nurses
- [Links](https://example.com) to helpful resources or research

> "Nursing is not just an art, it has a heart." - Share your favorite nursing quote or insight here.

\`Medical terminology\` or abbreviations can be formatted as inline code.

---

### Conclusion

Wrap up with actionable insights, encouragement for fellow nurses, or a call to reflection. What do you want your readers to take away?`
  }
}

const loadPost = async () => {
  if (!isEdit.value || !props.editId) {
    if (props.contentType) {
      currentType.value = props.contentType
    } else {
      currentType.value = 'blog' // Default to blog
    }
    // Reset original form for new items
    originalForm.value = {
      title: '',
      slug: '',
      excerpt: '',
      contentMarkdown: '',
      tags: [],
      status: 'draft',
    }
    // Set default markdown content for new items
    if (!form.value.contentMarkdown) {
      form.value.contentMarkdown = getDefaultMarkdown(currentType.value)
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
    } else {
      response = await fetch(`/api/admin/blog/posts/${props.editId}`, {
        headers,
        credentials: 'include',
      })
    }

    // Try to parse JSON - if it fails, check what we actually got
    try {
      const responseText = await response.text()
      
      // Try to parse as JSON
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        // If parsing fails, check if it's HTML (routing issue)
        if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
          console.error('Received HTML instead of JSON - API route may not be configured correctly')
          error.value = 'API endpoint not found. The route may not be properly configured on the server.'
          return
        }
        // If it's not HTML, it might be plain text error
        console.error('Failed to parse response as JSON:', responseText.substring(0, 200))
        error.value = `Server returned invalid response: ${responseText.substring(0, 100)}`
        return
      }
    } catch (textError) {
      console.error('Error reading response:', textError)
      error.value = 'Failed to read server response'
      return
    }

    if (response.ok && data.ok) {
      if (typeFromQuery === 'writing' || data.writing) {
        currentType.value = 'writing'
      } else if (typeFromQuery === 'blog' || data.post) {
        currentType.value = 'blog'
      }
    } else {
      // If first attempt failed and we didn't specify type, try the other type
      if (!typeFromQuery) {
        try {
          const otherResponse = await fetch(
            typeFromQuery === 'blog' 
              ? `/api/admin/writings/${props.editId}`
              : `/api/admin/blog/posts/${props.editId}`,
            {
              headers,
              credentials: 'include',
            }
          )
          const otherText = await otherResponse.text()
          try {
            const otherData = JSON.parse(otherText)
            if (otherResponse.ok && otherData.ok) {
              response = otherResponse
              data = otherData
              currentType.value = typeFromQuery === 'blog' ? 'writing' : 'blog'
            }
          } catch {
            // Ignore parse errors for fallback attempt
          }
        } catch {
          // Ignore errors for fallback attempt
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
    
    // Store original values for dirty checking
    originalForm.value = {
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      contentMarkdown: item.contentMarkdown,
      tags: [...(item.tags || [])],
      status: item.status,
    }

    tagsInput.value = form.value.tags.join(', ')
    updateTagsInput()
  } catch (err) {
    console.error('Error loading content:', err)
    error.value = `An error occurred while loading the content: ${err instanceof Error ? err.message : 'Unknown error'}`
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
    const headers: Record<string, string> = {
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
      console.error('Response status:', response.status)
      console.error('Response headers:', Object.fromEntries(response.headers.entries()))
      
      // Build detailed error message
      let errorMsg = data.error || data.message || `Failed to save ${type === 'writing' ? 'writing' : 'post'}`
      
      // Add more context if available
      if (data.code) {
        errorMsg += ` (Error code: ${data.code})`
      }
      
      if (data.message && data.message !== data.error) {
        errorMsg += `: ${data.message}`
      }
      
      // In development, show more details
      if (import.meta.env.DEV && data.stack) {
        console.error('Error stack:', data.stack)
        errorMsg += `\n\nStack: ${data.stack.substring(0, 200)}...`
      }
      
      error.value = errorMsg
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
    originalForm.value = {
      title: '',
      slug: '',
      excerpt: '',
      contentMarkdown: '',
      tags: [],
      status: 'draft',
    }
    tagsInput.value = ''
    newTagInput.value = ''
    showAllTags.value = false
    error.value = ''
    fieldErrors.value = {
      title: '',
      slug: '',
      excerpt: '',
      contentMarkdown: ''
    }
  }
})

watch(() => [props.contentType, props.isOpen], ([newType, isOpen]) => {
  if (isOpen && newType && (newType === 'blog' || newType === 'writing')) {
    // Set the initial type from props
    currentType.value = newType
    if (!isEdit.value) {
      // Update default content when contentType changes for new items
      if (!form.value.contentMarkdown || form.value.contentMarkdown === getDefaultMarkdown(newType === 'writing' ? 'blog' : 'writing')) {
        form.value.contentMarkdown = getDefaultMarkdown(newType)
      }
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

