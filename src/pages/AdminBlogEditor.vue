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
        <div class="space-y-3 pl-1">
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
            />
            <div v-if="fieldErrors.title" class="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
              {{ fieldErrors.title }}
            </div>
          </div>

          <!-- Slug -->
          <div>
            <label for="slug" class="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
              Slug <span class="text-red-500 dark:text-red-400">*</span>
            </label>
            <input
              id="slug"
              v-model="form.slug"
              type="text"
              required
              pattern="[a-z0-9-]+"
              class="w-full px-4 py-2 border rounded-md bg-white text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-1 focus:border-transparent font-mono text-sm dark:bg-slate-800"
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
            <label for="excerpt" class="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
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
            <label for="tags" class="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
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
          <div class="pl-1 pb-4">
            <div class="flex items-center gap-2 mb-1">
              <label for="contentMarkdown" class="block text-sm font-medium text-gray-700 dark:text-slate-200">
                Content (Markdown) <span class="text-red-500 dark:text-red-400">*</span>
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
              class="w-full px-3 py-1.5 border rounded-md bg-white text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-1 focus:border-transparent font-mono text-sm dark:bg-slate-800"
              :class="fieldErrors.contentMarkdown ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-slate-600'"
              @input="validateContentMarkdown"
              @blur="validateContentMarkdown"
            />
            <div v-if="fieldErrors.contentMarkdown" class="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
              {{ fieldErrors.contentMarkdown }}
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-3 pt-2 sticky top-0 bg-white dark:bg-slate-950 pb-2 z-10 border-t dark:border-slate-800 mt-2">
            <button
              type="submit"
              :disabled="saving || !canSubmit"
              :class="[
                contentType === 'writing' 
                  ? 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-500' 
                  : 'bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-500',
                (!canSubmit || saving) 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'shadow-md hover:shadow-lg'
              ]"
              class="px-5 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200"
            >
              <span v-if="!saving">{{ isEdit ? (contentType === 'writing' ? 'Update Writing' : 'Update Post') : (contentType === 'writing' ? 'Create Writing' : 'Create Post') }}</span>
              <span v-else>Saving...</span>
            </button>
            <router-link
              to="/admin"
              class="px-5 py-2 text-sm font-medium border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 dark:bg-slate-900 transition-colors shadow-sm"
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
              <MarkdownRenderer :content="form.contentMarkdown || '*Share your nursing story, insights, or reflections here. Your words matter.*'" />
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
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-slate-100">Markdown Formatting Guide</h2>
            <p class="text-sm text-gray-600 dark:text-slate-400 mt-1">Format your nursing stories and reflections</p>
          </div>
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
              <p class="text-xs text-gray-600 dark:text-slate-400 mb-1">Structure your nursing stories</p>
              <div class="bg-gray-50 dark:bg-slate-800 p-3 rounded font-mono text-xs">
                <div># Reflections on Night Shift</div>
                <div>## Patient Care Experiences</div>
                <div>### Lessons Learned</div>
              </div>
            </div>

            <!-- Emphasis -->
            <div>
              <h3 class="text-base font-semibold text-gray-900 dark:text-slate-100 mb-2">Emphasis</h3>
              <p class="text-xs text-gray-600 dark:text-slate-400 mb-1">Highlight important concepts or moments</p>
              <div class="bg-gray-50 dark:bg-slate-800 p-3 rounded font-mono text-xs space-y-1">
                <div>*gentle reminder* or _personal reflection_</div>
                <div>**critical care protocol** or __important note__</div>
                <div>***urgent patient need***</div>
              </div>
            </div>

            <!-- Lists -->
            <div>
              <h3 class="text-base font-semibold text-gray-900 dark:text-slate-100 mb-2">Lists</h3>
              <p class="text-xs text-gray-600 dark:text-slate-400 mb-1">Organize tips, steps, or insights</p>
              <div class="bg-gray-50 dark:bg-slate-800 p-3 rounded font-mono text-xs space-y-1">
                <div>Unordered (tips):</div>
                <div class="ml-2">- Always verify patient identity</div>
                <div class="ml-2">- Practice active listening</div>
                <div class="mt-2">Ordered (steps):</div>
                <div class="ml-2">1. Assess patient condition</div>
                <div class="ml-2">2. Document findings</div>
              </div>
            </div>

            <!-- Links -->
            <div>
              <h3 class="text-base font-semibold text-gray-900 dark:text-slate-100 mb-2">Links</h3>
              <p class="text-xs text-gray-600 dark:text-slate-400 mb-1">Reference nursing resources or research</p>
              <div class="bg-gray-50 dark:bg-slate-800 p-3 rounded font-mono text-xs space-y-1">
                <div>[ANA Code of Ethics](https://www.nursingworld.org/)</div>
                <div>[Evidence-based guidelines](https://example.com "Nursing Research")</div>
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
              <h3 class="text-base font-semibold text-gray-900 dark:text-slate-100 mb-2">Code & Medical Terms</h3>
              <p class="text-xs text-gray-600 dark:text-slate-400 mb-1">Format abbreviations or medication names</p>
              <div class="bg-gray-50 dark:bg-slate-800 p-3 rounded font-mono text-xs space-y-1">
                <div>Inline: `BP`, `HR`, `O2 sat`, `PRN`</div>
                <div class="mt-2">For medication lists:</div>
                <div class="ml-2">```</div>
                <div class="ml-2">Morphine 2mg IV Q4H PRN</div>
                <div class="ml-2">```</div>
              </div>
            </div>

            <!-- Blockquotes -->
            <div>
              <h3 class="text-base font-semibold text-gray-900 dark:text-slate-100 mb-2">Blockquotes</h3>
              <p class="text-xs text-gray-600 dark:text-slate-400 mb-1">Highlight quotes or patient words</p>
              <div class="bg-gray-50 dark:bg-slate-800 p-3 rounded font-mono text-xs">
                <div>&gt; "Nursing is not just an art, it has a heart."</div>
                <div>&gt; </div>
                <div>&gt; "Thank you for being here," the patient said.</div>
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
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AdminLayout from '@/components/AdminLayout.vue'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'

const router = useRouter()
const route = useRoute()

const isEdit = computed(() => !!route.params.id)
const currentType = ref<'blog' | 'writing'>('blog')
const contentType = computed(() => currentType.value)

const toggleContentType = () => {
  if (isEdit.value) {
    // When editing, allow toggle - the save will handle the endpoint
    currentType.value = currentType.value === 'blog' ? 'writing' : 'blog'
  } else {
    // For new items, toggle and update default content
    currentType.value = currentType.value === 'blog' ? 'writing' : 'blog'
    // Update default markdown content when type changes
    if (!form.value.contentMarkdown || form.value.contentMarkdown === getDefaultMarkdown(currentType.value === 'blog' ? 'writing' : 'blog')) {
      form.value.contentMarkdown = getDefaultMarkdown(currentType.value)
    }
  }
}

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
    // Auto-generate slug from title (only for new posts)
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

const loadPost = async () => {
  if (!isEdit.value) {
    // Set type from query param for new items, default to blog
    if (route.query.type === 'writing') {
      currentType.value = 'writing'
    } else if (route.query.type === 'blog') {
      currentType.value = 'blog'
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

