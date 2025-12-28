<template>
  <AdminLayout title="Writings" subtitle="Manage your writings">
    <div class="space-y-6">
      <!-- Actions -->
      <div class="flex items-center justify-between gap-4 flex-wrap">
        <div class="flex items-center gap-3 flex-wrap">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search writings..."
            class="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
            @input="debouncedSearch"
          />
          <select
            v-model="statusFilter"
            class="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
            @change="resetPageAndFetch"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <button
          @click="openModal(null)"
          class="px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-md hover:bg-purple-700 dark:hover:bg-purple-600 transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 font-medium"
        >
          <span class="flex items-center gap-2">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Writing
          </span>
        </button>
      </div>

      <!-- Pagination summary -->
      <div
        v-if="!loading && pagination && pagination.total > 0"
        class="flex items-center justify-between gap-4 bg-white dark:bg-slate-900 rounded-lg shadow border border-gray-200 dark:border-slate-700 px-4 py-2"
      >
        <div
          class="text-xs text-gray-600 dark:text-slate-400 whitespace-nowrap"
        >
          <span class="font-medium text-gray-700 dark:text-slate-300"
            >{{ (pagination.page - 1) * pagination.pageSize + 1 }}-{{
              Math.min(pagination.page * pagination.pageSize, pagination.total)
            }}</span
          >
          <span class="mx-1">of</span>
          <span class="font-medium text-gray-700 dark:text-slate-300">{{
            pagination.total
          }}</span>
          <span class="ml-1">{{
            pagination.total === 1 ? 'item' : 'items'
          }}</span>
        </div>
        <div
          v-if="pagination.totalPages > 1"
          class="flex items-center gap-3 flex-1 justify-center"
        >
          <button
            @click="changePage(pagination.page - 1)"
            :disabled="pagination.page === 1"
            class="px-2.5 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            ← Previous
          </button>
          <span class="text-xs text-gray-600 dark:text-slate-400">
            Page
            <span class="font-medium text-gray-700 dark:text-slate-300">{{
              pagination.page
            }}</span>
            of
            <span class="font-medium text-gray-700 dark:text-slate-300">{{
              pagination.totalPages
            }}</span>
          </span>
          <button
            @click="changePage(pagination.page + 1)"
            :disabled="pagination.page === pagination.totalPages"
            class="px-2.5 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            Next →
          </button>
        </div>
        <div
          v-else
          class="text-xs text-gray-500 dark:text-slate-400 whitespace-nowrap"
        >
          All items shown
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600 dark:text-slate-300">Loading writings...</p>
      </div>

      <!-- Error -->
      <div v-if="error" class="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
        <p class="text-sm text-red-800 dark:text-red-200">{{ error }}</p>
      </div>

      <!-- Writings Table -->
      <div
        v-if="!loading"
        class="bg-white dark:bg-slate-900 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700"
      >
        <table
          class="min-w-full divide-y divide-gray-200 dark:divide-slate-700"
        >
          <thead class="bg-gray-50 dark:bg-slate-800">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider"
              >
                Title
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider"
              >
                Updated
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider"
              >
                Published
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider"
              >
                Tags
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody
            class="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-700"
          >
            <tr
              v-for="item in writings"
              :key="item.id"
              class="hover:bg-gray-50 dark:hover:bg-slate-800"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <button
                  @click="openModal(item.id)"
                  class="text-left hover:opacity-80 transition-opacity"
                >
                  <div
                    class="text-sm font-medium text-gray-900 dark:text-slate-100 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    {{ item.title }}
                  </div>
                  <div
                    class="text-sm text-gray-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400"
                  >
                    /{{ item.slug }}
                  </div>
                </button>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button
                  @click="toggleStatus(item)"
                  :disabled="togglingStatus === item.id"
                  :class="[
                    {
                      'bg-gradient-to-r from-amber-400 to-orange-500 text-white dark:from-amber-500 dark:to-orange-600 hover:from-amber-500 hover:to-orange-600 dark:hover:from-amber-600 dark:hover:to-orange-700 focus:ring-amber-500':
                        item.status === 'draft',
                      'bg-gradient-to-r from-emerald-400 to-green-500 text-white dark:from-emerald-500 dark:to-green-600 hover:from-emerald-500 hover:to-green-600 dark:hover:from-emerald-600 dark:hover:to-green-700 focus:ring-emerald-500':
                        item.status === 'published',
                    },
                    'px-4 py-2 text-xs font-semibold rounded-full cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg',
                  ]"
                  :title="`Click to toggle to ${item.status === 'draft' ? 'published' : 'draft'}`"
                >
                  <span
                    v-if="togglingStatus === item.id"
                    class="inline-flex items-center gap-1.5"
                  >
                    <svg
                      class="animate-spin h-3.5 w-3.5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Updating...
                  </span>
                  <span v-else class="inline-flex items-center gap-1.5">
                    <svg
                      v-if="item.status === 'draft'"
                      class="h-3.5 w-3.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <svg
                      v-else
                      class="h-3.5 w-3.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span class="uppercase tracking-wide">{{
                      item.status
                    }}</span>
                  </span>
                </button>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400"
              >
                {{ formatDate(item.updatedAt) }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400"
              >
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
                  <span
                    v-if="(item.tags || []).length > 3"
                    class="text-xs text-gray-500 dark:text-slate-400"
                  >
                    +{{ (item.tags || []).length - 3 }}
                  </span>
                </div>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <div class="flex items-center justify-end gap-4">
                  <button
                    @click="handleDuplicate(item)"
                    :disabled="duplicatingItem === item.id"
                    class="text-purple-600 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Duplicate this writing"
                  >
                    <span
                      v-if="duplicatingItem === item.id"
                      class="inline-flex items-center gap-1"
                    >
                      <svg
                        class="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        ></circle>
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Duplicating...
                    </span>
                    <span v-else class="inline-flex items-center gap-1">
                      <svg
                        class="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Duplicate
                    </span>
                  </button>
                  <button
                    @click="openModal(item.id)"
                    class="text-purple-600 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300"
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
        <div v-if="writings.length === 0 && !loading" class="text-center py-16">
          <div class="max-w-lg mx-auto">
            <div class="mb-6">
              <svg
                class="mx-auto h-20 w-20 text-gray-300 dark:text-slate-600 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3
              class="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-3"
            >
              {{
                searchQuery || statusFilter
                  ? 'No writings match your filters'
                  : 'No writings yet'
              }}
            </h3>
            <p class="text-lg text-gray-600 dark:text-slate-400 mb-6">
              {{
                searchQuery || statusFilter
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by creating your first writing!'
              }}
            </p>
            <div v-if="searchQuery || statusFilter" class="mt-6">
              <button
                @click="clearFilters"
                class="inline-flex items-center px-6 py-3 border-2 border-purple-600 dark:border-purple-500 rounded-lg text-base font-medium text-purple-600 dark:text-purple-400 bg-white dark:bg-slate-900 hover:bg-purple-50 dark:hover:bg-purple-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all shadow-sm hover:shadow-md"
              >
                Clear filters
              </button>
            </div>
            <div v-else class="mt-6">
              <button
                @click="openModal(null)"
                class="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 dark:bg-purple-700 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 font-medium text-base"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Writing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Editor Modal -->
    <AdminEditorModal
      :is-open="showEditorModal"
      :edit-id="editId"
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
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'
import AdminEditorModal from '@/components/AdminEditorModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

const writings = ref<any[]>([])
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')
const statusFilter = ref('')
const pagination = ref({ page: 1, pageSize: 12, total: 0, totalPages: 1 })
const togglingStatus = ref<string | null>(null)
const duplicatingItem = ref<string | null>(null)

const showEditorModal = ref(false)
const editId = ref<string | null>(null)

const showDeleteConfirmModal = ref(false)
const deleteConfirmMessage = ref('')
const itemToDelete = ref<any>(null)

let searchTimeout: ReturnType<typeof setTimeout> | null = null

const buildHeaders = () => {
  const token = localStorage.getItem('auth_token')
  const headers: Record<string, string> = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

const fetchWritings = async () => {
  loading.value = true
  error.value = ''

  try {
    const params = new URLSearchParams()
    if (searchQuery.value) params.append('q', searchQuery.value)
    if (statusFilter.value) params.append('status', statusFilter.value)
    params.append('page', pagination.value.page.toString())
    params.append('pageSize', pagination.value.pageSize.toString())

    const response = await fetch(`/api/admin/writings?${params.toString()}`, {
      headers: buildHeaders(),
      credentials: 'include',
    })

    const contentType = response.headers.get('content-type') || ''
    let data: any = null
    if (contentType.includes('application/json')) {
      data = await response.json()
    } else {
      const text = await response.text()
      throw new Error(text || 'Invalid response from server')
    }

    if (!response.ok || !data?.ok) {
      throw new Error(
        data?.error || data?.message || 'Failed to fetch writings'
      )
    }

    writings.value = data.writings || []
    pagination.value = data.pagination || {
      page: 1,
      pageSize: 12,
      total: writings.value.length,
      totalPages: 1,
    }
  } catch (err) {
    console.error('Error fetching writings:', err)
    error.value =
      err instanceof Error ? err.message : 'Failed to fetch writings'
    writings.value = []
    pagination.value = { page: 1, pageSize: 12, total: 0, totalPages: 1 }
  } finally {
    loading.value = false
  }
}

const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value.page = 1
    fetchWritings()
  }, 300)
}

const resetPageAndFetch = () => {
  pagination.value.page = 1
  fetchWritings()
}

const changePage = (page: number) => {
  pagination.value.page = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
  fetchWritings()
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  pagination.value.page = 1
  fetchWritings()
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const openModal = (id: string | null) => {
  editId.value = id
  showEditorModal.value = true
}

const closeModal = () => {
  showEditorModal.value = false
  editId.value = null
}

const handleEditorSaved = () => {
  fetchWritings()
}

const toggleStatus = async (item: any) => {
  if (togglingStatus.value === item.id) return

  const newStatus = item.status === 'draft' ? 'published' : 'draft'
  togglingStatus.value = item.id

  try {
    const response = await fetch(`/api/admin/writings/${item.id}`, {
      method: 'PUT',
      headers: {
        ...buildHeaders(),
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ status: newStatus }),
    })

    const contentType = response.headers.get('content-type') || ''
    let data: any = null
    if (contentType.includes('application/json')) {
      data = await response.json()
    } else {
      const text = await response.text()
      throw new Error(text || `Server returned ${response.status}`)
    }

    if (!response.ok || !data?.ok) {
      throw new Error(
        data?.error || `Failed to update status (${response.status})`
      )
    }

    const updated = data.writing || {
      ...item,
      status: newStatus,
      publishedAt: newStatus === 'published' ? new Date().toISOString() : null,
    }
    const index = writings.value.findIndex((w) => w.id === item.id)
    if (index !== -1) {
      writings.value[index] = { ...writings.value[index], ...updated }
    }
  } catch (err) {
    console.error('Error toggling status:', err)
    error.value = err instanceof Error ? err.message : 'Failed to update status'
  } finally {
    togglingStatus.value = null
  }
}

const handleDuplicate = async (item: any) => {
  if (duplicatingItem.value === item.id) return
  duplicatingItem.value = item.id

  try {
    const response = await fetch(`/api/admin/writings/${item.id}`, {
      method: 'POST',
      headers: buildHeaders(),
      credentials: 'include',
    })

    const contentType = response.headers.get('content-type') || ''
    let data: any = null
    if (contentType.includes('application/json')) {
      data = await response.json()
    } else {
      const text = await response.text()
      throw new Error(text || `Server returned ${response.status}`)
    }

    if (!response.ok || !data?.ok) {
      throw new Error(data?.error || 'Failed to duplicate writing')
    }

    fetchWritings()
  } catch (err) {
    console.error('Error duplicating writing:', err)
    error.value =
      err instanceof Error ? err.message : 'Failed to duplicate writing'
  } finally {
    duplicatingItem.value = null
  }
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

  try {
    const response = await fetch(
      `/api/admin/writings/${itemToDelete.value.id}`,
      {
        method: 'DELETE',
        headers: buildHeaders(),
        credentials: 'include',
      }
    )

    const contentType = response.headers.get('content-type') || ''
    let data: any = null
    if (contentType.includes('application/json')) {
      data = await response.json()
    } else {
      const text = await response.text()
      throw new Error(text || `Server returned ${response.status}`)
    }

    if (!response.ok || !data?.ok) {
      throw new Error(data?.error || `Failed to delete (${response.status})`)
    }

    fetchWritings()
  } catch (err) {
    console.error('Error deleting writing:', err)
    error.value =
      err instanceof Error ? err.message : 'Failed to delete writing'
  } finally {
    itemToDelete.value = null
    showDeleteConfirmModal.value = false
  }
}

const cancelDelete = () => {
  showDeleteConfirmModal.value = false
  itemToDelete.value = null
}

onMounted(() => {
  fetchWritings()
})
</script>
