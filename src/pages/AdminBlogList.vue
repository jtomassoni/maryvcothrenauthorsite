<template>
  <AdminLayout title="Content Management" subtitle="Manage your blog posts and writings">
    <!-- Toast Notification -->
    <div
      v-if="notification && notification.message"
      :class="{
        'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200': notification.type === 'success',
        'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200': notification.type === 'error',
      }"
      class="fixed top-4 right-4 z-50 rounded-md border shadow-lg p-4 flex items-center justify-between min-w-[300px] max-w-md animate-slide-in"
      role="alert"
    >
      <div class="flex items-center flex-1">
        <svg
          v-if="notification.type === 'success'"
          class="h-5 w-5 text-green-400 mr-3 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <svg
          v-else
          class="h-5 w-5 text-red-400 mr-3 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <p class="text-sm font-medium">
          {{ notification.message }}
        </p>
      </div>
      <button
        @click="clearNotification"
        class="ml-4 text-gray-400 hover:text-gray-600 dark:text-slate-300 dark:hover:text-slate-100 flex-shrink-0"
        aria-label="Dismiss notification"
      >
        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>

    <div class="space-y-6">
      <!-- Actions -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search content..."
            class="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
            @input="debouncedSearch"
          />
          <select
            v-model="typeFilter"
            class="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
            @change="fetchContent"
          >
            <option value="">All Types</option>
            <option value="blog">Blog Posts</option>
            <option value="writing">Writings</option>
          </select>
          <select
            v-model="statusFilter"
            class="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
            @change="fetchContent"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div class="flex gap-2">
          <button
            @click="openModal(null, 'blog')"
            class="px-4 py-2 bg-primary-800 dark:bg-primary-700 text-white rounded-md hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors shadow-sm dark:shadow-md"
          >
            New Blog Post
          </button>
          <button
            @click="openModal(null, 'writing')"
            class="px-4 py-2 bg-purple-800 dark:bg-purple-700 text-white rounded-md hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors shadow-sm dark:shadow-md"
          >
            New Writing
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600 dark:text-slate-300">Loading content...</p>
      </div>

      <!-- Error -->
      <div v-if="error" class="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
        <p class="text-sm text-red-800 dark:text-red-200">{{ error }}</p>
      </div>

      <!-- Posts Table -->
      <div v-if="!loading" class="bg-white dark:bg-slate-900 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead class="bg-gray-50 dark:bg-slate-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                Type
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                Title
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                Updated
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                Published
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                Tags
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-700">
            <tr v-for="item in items" :key="`${item.type}-${item.id}`" class="hover:bg-gray-50 dark:hover:bg-slate-800">
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="{
                    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200': item.type === 'blog',
                    'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200': item.type === 'writing',
                  }"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ item.type === 'blog' ? 'Blog' : 'Writing' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-slate-100">
                  {{ item.title }}
                </div>
                <div class="text-sm text-gray-500 dark:text-slate-400">
                  /{{ item.slug }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button
                  @click="toggleStatus(item)"
                  :disabled="togglingStatus === `${item.type}-${item.id}`"
                  :class="{
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-900/50': item.status === 'draft',
                    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-900/50': item.status === 'published',
                  }"
                  class="px-3 py-1.5 text-xs font-medium rounded-full cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
                  :title="`Click to toggle to ${item.status === 'draft' ? 'published' : 'draft'}`"
                >
                  <span v-if="togglingStatus === `${item.type}-${item.id}`" class="inline-flex items-center gap-1.5">
                    <svg class="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                  <span v-else class="inline-flex items-center gap-1.5">
                    {{ item.status }}
                    <svg class="h-3 w-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </span>
                </button>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                {{ formatDate(item.updatedAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                {{ item.publishedAt ? formatDate(item.publishedAt) : '-' }}
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="tag in (item.tags || []).slice(0, 3)"
                    :key="tag"
                    class="px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 dark:border dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded"
                  >
                    {{ tag }}
                  </span>
                  <span v-if="(item.tags || []).length > 3" class="text-xs text-gray-500 dark:text-slate-400">
                    +{{ (item.tags || []).length - 3 }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end gap-4">
                  <button
                    @click="handleDuplicate(item)"
                    :disabled="duplicatingItem === `${item.type}-${item.id}`"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    :title="`Duplicate this ${item.type}`"
                  >
                    <span v-if="duplicatingItem === `${item.type}-${item.id}`" class="inline-flex items-center gap-1">
                      <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Duplicating...
                    </span>
                    <span v-else class="inline-flex items-center gap-1">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Duplicate
                    </span>
                  </button>
                  <button
                    @click="openModal(item.id, item.type)"
                    class="text-primary-600 dark:text-blue-400 hover:text-primary-900 dark:hover:text-blue-300"
                  >
                    Edit
                  </button>
                  <button
                    @click="handleDelete(item)"
                    class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty state -->
        <div v-if="items.length === 0" class="text-center py-12">
          <p class="text-gray-600 dark:text-slate-300">No content found.</p>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination && pagination.totalPages > 1" class="flex items-center justify-between">
        <div class="text-sm text-gray-700 dark:text-slate-300">
          Showing {{ (pagination.page - 1) * pagination.pageSize + 1 }} to
          {{ Math.min(pagination.page * pagination.pageSize, pagination.total) }} of
          {{ pagination.total }} items
        </div>
        <div class="flex gap-2">
          <button
            @click="changePage(pagination.page - 1)"
            :disabled="pagination.page === 1"
            class="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700"
          >
            Previous
          </button>
          <button
            @click="changePage(pagination.page + 1)"
            :disabled="pagination.page === pagination.totalPages"
            class="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Editor Modal -->
    <AdminEditorModal
      :is-open="showEditorModal"
      :edit-id="editId"
      :content-type="editorContentType"
      @close="closeModal"
      @saved="handleEditorSaved"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      :is-open="showDeleteConfirmModal"
      title="Confirm Deletion"
      :message="deleteConfirmMessage"
      confirm-text="Delete"
      cancel-text="Cancel"
      confirm-button-class="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
      @confirm="executeDelete"
      @cancel="cancelDelete"
    />

    <!-- Duplicate Confirmation Modal -->
    <ConfirmModal
      :is-open="showDuplicateConfirmModal"
      title="Confirm Duplication"
      :message="duplicateConfirmMessage"
      confirm-text="Duplicate"
      cancel-text="Cancel"
      confirm-button-class="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
      @confirm="executeDuplicate"
      @cancel="cancelDuplicate"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AdminLayout from '@/components/AdminLayout.vue'
import AdminEditorModal from '@/components/AdminEditorModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

const router = useRouter()
const route = useRoute()

const items = ref<any[]>([])
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')
const typeFilter = ref('')
const statusFilter = ref('')
const pagination = ref<any>(null)
const togglingStatus = ref<string | null>(null)
const duplicatingItem = ref<string | null>(null)
const notification = ref<{ type: 'success' | 'error'; message: string } | null>(null)
let notificationTimeout: ReturnType<typeof setTimeout> | null = null

// Editor modal state
const showEditorModal = ref(false)
const editId = ref<string | null>(null)
const editorContentType = ref<'blog' | 'writing'>('blog')

// Delete confirmation modal state
const showDeleteConfirmModal = ref(false)
const deleteConfirmMessage = ref('')
const itemToDelete = ref<any>(null)

// Duplicate confirmation modal state
const showDuplicateConfirmModal = ref(false)
const duplicateConfirmMessage = ref('')
const itemToDuplicate = ref<any>(null)

let searchTimeout: ReturnType<typeof setTimeout> | null = null

const openModal = (id: string | null, type: 'blog' | 'writing') => {
  editId.value = id
  editorContentType.value = type
  showEditorModal.value = true
  // Update route without navigation
  if (id) {
    router.push(`/admin/blog/${id}/edit?type=${type}`).catch(() => {})
  } else {
    router.push(`/admin/blog/new?type=${type}`).catch(() => {})
  }
}

const closeModal = () => {
  showEditorModal.value = false
  editId.value = null
  // Return to admin list
  if (route.path !== '/admin') {
    router.push('/admin').catch(() => {})
  }
}

const handleEditorSaved = () => {
  fetchContent()
  showNotification('Content saved successfully', 'success')
}

// Watch route changes to open modal
watch(() => route.path, (newPath) => {
  if (newPath === '/admin/blog/new') {
    const type = route.query.type === 'writing' ? 'writing' : 'blog'
    if (!showEditorModal.value || editId.value !== null || editorContentType.value !== type) {
      openModal(null, type)
    }
  } else if (newPath.match(/^\/admin\/blog\/[^/]+\/edit$/)) {
    const id = route.params.id as string
    const type = route.query.type === 'writing' ? 'writing' : 'blog'
    if (!showEditorModal.value || editId.value !== id || editorContentType.value !== type) {
      openModal(id, type)
    }
  } else if (newPath === '/admin' && showEditorModal.value) {
    closeModal()
  }
}, { immediate: true })

const fetchContent = async () => {
  loading.value = true
  error.value = ''

  try {
    // Get token from localStorage
    const token = localStorage.getItem('auth_token')
    const headers: Record<string, string> = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // Fetch both blog posts and writings
    const params = new URLSearchParams()
    if (searchQuery.value) params.append('q', searchQuery.value)
    if (statusFilter.value) params.append('status', statusFilter.value)
    if (pagination.value) params.append('page', pagination.value.page.toString())

    const [blogResponse, writingResponse] = await Promise.all([
      typeFilter.value === 'writing' ? null : fetch(`/api/admin/blog/posts?${params.toString()}`, {
        headers,
        credentials: 'include',
      }),
      typeFilter.value === 'blog' ? null : fetch(`/api/admin/writings?${params.toString()}`, {
        headers,
        credentials: 'include',
      }),
    ])

    const blogData = blogResponse ? await blogResponse.json() : { ok: true, posts: [], pagination: { total: 0 } }
    const writingData = writingResponse ? await writingResponse.json() : { ok: true, writings: [], pagination: { total: 0 } }

    if ((blogResponse && (!blogResponse.ok || !blogData.ok)) || (writingResponse && (!writingResponse.ok || !writingData.ok))) {
      error.value = blogData.error || writingData.error || 'Failed to fetch content'
      return
    }

    // Combine and add type identifier
    const combined = [
      ...(blogData.posts || []).map((post: any) => ({ ...post, type: 'blog' })),
      ...(writingData.writings || []).map((writing: any) => ({ ...writing, type: 'writing' })),
    ]

    // Sort by updatedAt (most recent first)
    combined.sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime()
      const dateB = new Date(b.updatedAt).getTime()
      return dateB - dateA
    })

    items.value = combined
    pagination.value = {
      page: pagination.value?.page || 1,
      pageSize: pagination.value?.pageSize || 20,
      total: (blogData.pagination?.total || 0) + (writingData.pagination?.total || 0),
      totalPages: Math.ceil(((blogData.pagination?.total || 0) + (writingData.pagination?.total || 0)) / (pagination.value?.pageSize || 20)),
    }
  } catch (err) {
    console.error('Error fetching content:', err)
    error.value = 'An error occurred while fetching content'
  } finally {
    loading.value = false
  }
}

const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value = { ...pagination.value, page: 1 }
    fetchContent()
  }, 300)
}

const changePage = (page: number) => {
  if (!pagination.value) return
  pagination.value = { ...pagination.value, page }
  fetchContent()
}

const toggleStatus = async (item: any) => {
  const itemKey = `${item.type}-${item.id}`
  if (togglingStatus.value === itemKey) return
  
  const newStatus = item.status === 'draft' ? 'published' : 'draft'
  togglingStatus.value = itemKey

  try {
    // Get token from localStorage
    const token = localStorage.getItem('auth_token')
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const endpoint = item.type === 'blog' 
      ? `/api/admin/blog/posts/${item.id}`
      : `/api/admin/writings/${item.id}`
    
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers,
      credentials: 'include',
      body: JSON.stringify({
        status: newStatus,
      }),
    })

    const data = await response.json()

    if (!response.ok || !data.ok) {
      showNotification('error', data.error || 'Failed to update status')
      return
    }

    // Update the item in the list
    const index = items.value.findIndex(i => i.id === item.id && i.type === item.type)
    if (index !== -1) {
      const updated = item.type === 'blog' ? data.post : data.writing
      items.value[index] = { ...updated, type: item.type }
    }
    showNotification('success', `${item.type === 'blog' ? 'Post' : 'Writing'} ${newStatus === 'published' ? 'published' : 'moved to draft'} successfully`)
  } catch (err) {
    console.error('Error toggling status:', err)
    showNotification('error', 'An error occurred while updating the status')
  } finally {
    togglingStatus.value = null
  }
}

const handleDuplicate = (item: any) => {
  itemToDuplicate.value = item
  duplicateConfirmMessage.value = `Are you sure you want to duplicate "${item.title}"? A copy will be created as a draft.`
  showDuplicateConfirmModal.value = true
}

const executeDuplicate = async () => {
  if (!itemToDuplicate.value) {
    showDuplicateConfirmModal.value = false
    return
  }

  const item = itemToDuplicate.value
  const itemKey = `${item.type}-${item.id}`
  showDuplicateConfirmModal.value = false
  
  if (duplicatingItem.value === itemKey) return
  
  duplicatingItem.value = itemKey

  try {
    // Get token from localStorage
    const token = localStorage.getItem('auth_token')
    const headers: Record<string, string> = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const endpoint = item.type === 'blog'
      ? `/api/admin/blog/posts/${item.id}/duplicate`
      : `/api/admin/writings/${item.id}/duplicate`
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      credentials: 'include',
    })

    const data = await response.json()

    if (!response.ok || !data.ok) {
      showNotification('error', data.error || 'Failed to duplicate')
      return
    }

    // Refresh content to show the new duplicate
    fetchContent()
    showNotification('success', `${item.type === 'blog' ? 'Post' : 'Writing'} duplicated successfully`)
  } catch (err) {
    console.error('Error duplicating:', err)
    showNotification('error', 'An error occurred while duplicating')
  } finally {
    duplicatingItem.value = null
    itemToDuplicate.value = null
  }
}

const cancelDuplicate = () => {
  showDuplicateConfirmModal.value = false
  itemToDuplicate.value = null
}

const handleDelete = (item: any) => {
  itemToDelete.value = item
  deleteConfirmMessage.value = `Are you sure you want to delete "${item.title}"? This action cannot be undone.`
  showDeleteConfirmModal.value = true
}

const executeDelete = async () => {
  if (!itemToDelete.value) {
    showDeleteConfirmModal.value = false
    return
  }

  const item = itemToDelete.value
  showDeleteConfirmModal.value = false

  try {
    // Get token from localStorage
    const token = localStorage.getItem('auth_token')
    const headers: Record<string, string> = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const endpoint = item.type === 'blog'
      ? `/api/admin/blog/posts/${item.id}`
      : `/api/admin/writings/${item.id}`
    
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers,
      credentials: 'include',
    })

    const data = await response.json()

    if (!response.ok || !data.ok) {
      showNotification('error', data.error || 'Failed to delete')
      return
    }

    // Refresh content
    fetchContent()
    showNotification('success', `${item.type === 'blog' ? 'Post' : 'Writing'} deleted successfully`)
  } catch (err) {
    console.error('Error deleting:', err)
    showNotification('error', 'An error occurred while deleting')
  } finally {
    itemToDelete.value = null
  }
}

const cancelDelete = () => {
  showDeleteConfirmModal.value = false
  itemToDelete.value = null
}

const showNotification = (type: 'success' | 'error', message: string) => {
  notification.value = { type, message }
  
  // Clear any existing timeout
  if (notificationTimeout) {
    clearTimeout(notificationTimeout)
  }
  
  // Auto-dismiss after 5 seconds
  notificationTimeout = setTimeout(() => {
    clearNotification()
  }, 5000)
}

const clearNotification = () => {
  notification.value = null
  if (notificationTimeout) {
    clearTimeout(notificationTimeout)
    notificationTimeout = null
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

onMounted(() => {
  pagination.value = { page: 1, pageSize: 20, total: 0, totalPages: 1 }
  fetchContent()
})
</script>


