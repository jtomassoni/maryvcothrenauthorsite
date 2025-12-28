<template>
  <AdminLayout title="Content Management" subtitle="Manage your blog posts and writings">
    <!-- Toast Notification -->
    <div
      v-if="notification && notification.message"
      :class="{
        'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200': notification.type === 'success',
        'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200': notification.type === 'error',
      }"
      class="fixed bottom-4 right-4 z-50 rounded-md border shadow-lg p-4 flex items-center justify-between min-w-[300px] max-w-md animate-slide-in"
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
            class="px-4 py-2 bg-cyan-600 dark:bg-cyan-700 text-white rounded-md hover:bg-cyan-700 dark:hover:bg-cyan-600 transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 font-medium"
          >
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              New
            </span>
          </button>
        </div>
      </div>

      <!-- Pagination (above the fold) -->
      <div v-if="!loading && pagination && pagination.total > 0" class="flex items-center justify-between gap-4 bg-white dark:bg-slate-900 rounded-lg shadow border border-gray-200 dark:border-slate-700 px-4 py-2">
        <div class="text-xs text-gray-600 dark:text-slate-400 whitespace-nowrap">
          <span class="font-medium text-gray-700 dark:text-slate-300">{{ (pagination.page - 1) * pagination.pageSize + 1 }}-{{ Math.min(pagination.page * pagination.pageSize, pagination.total) }}</span>
          <span class="mx-1">of</span>
          <span class="font-medium text-gray-700 dark:text-slate-300">{{ pagination.total }}</span>
          <span class="ml-1">{{ pagination.total === 1 ? 'item' : 'items' }}</span>
        </div>
        <div v-if="pagination.totalPages > 1" class="flex items-center gap-3 flex-1 justify-center">
          <button
            @click="changePage(pagination.page - 1)"
            :disabled="pagination.page === 1"
            class="px-2.5 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            ← Previous
          </button>
          <span class="text-xs text-gray-600 dark:text-slate-400">
            Page <span class="font-medium text-gray-700 dark:text-slate-300">{{ pagination.page }}</span> of <span class="font-medium text-gray-700 dark:text-slate-300">{{ pagination.totalPages }}</span>
          </span>
          <button
            @click="changePage(pagination.page + 1)"
            :disabled="pagination.page === pagination.totalPages"
            class="px-2.5 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            Next →
          </button>
        </div>
        <div v-else class="text-xs text-gray-500 dark:text-slate-400 whitespace-nowrap">
          All items shown
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
              <th 
                @click="handleSort('title')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors select-none"
              >
                <div class="flex items-center gap-1">
                  Title
                  <div class="flex flex-col">
                    <svg 
                      class="w-3 h-3" 
                      :class="sortField === 'title' && sortDirection === 'asc' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-slate-500'"
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    <svg 
                      class="w-3 h-3 -mt-1" 
                      :class="sortField === 'title' && sortDirection === 'desc' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-slate-500'"
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
              </th>
              <th 
                @click="handleSort('status')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors select-none"
              >
                <div class="flex items-center gap-1">
                  Status
                  <div class="flex flex-col">
                    <svg 
                      class="w-3 h-3" 
                      :class="sortField === 'status' && sortDirection === 'asc' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-slate-500'"
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    <svg 
                      class="w-3 h-3 -mt-1" 
                      :class="sortField === 'status' && sortDirection === 'desc' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-slate-500'"
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
              </th>
              <th 
                @click="handleSort('updatedAt')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors select-none"
              >
                <div class="flex items-center gap-1">
                  Updated
                  <div class="flex flex-col">
                    <svg 
                      class="w-3 h-3" 
                      :class="sortField === 'updatedAt' && sortDirection === 'asc' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-slate-500'"
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    <svg 
                      class="w-3 h-3 -mt-1" 
                      :class="sortField === 'updatedAt' && sortDirection === 'desc' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-slate-500'"
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
              </th>
              <th 
                @click="handleSort('publishedAt')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors select-none"
              >
                <div class="flex items-center gap-1">
                  Published
                  <div class="flex flex-col">
                    <svg 
                      class="w-3 h-3" 
                      :class="sortField === 'publishedAt' && sortDirection === 'asc' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-slate-500'"
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    <svg 
                      class="w-3 h-3 -mt-1" 
                      :class="sortField === 'publishedAt' && sortDirection === 'desc' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-slate-500'"
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
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
            <tr v-for="item in paginatedItems" :key="`${item.type}-${item.id}`" class="hover:bg-gray-50 dark:hover:bg-slate-800">
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="{
                    'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200': item.type === 'blog',
                    'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200': item.type === 'writing',
                  }"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ item.type === 'blog' ? 'Blog' : 'Writing' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button
                  @click="openModal(item.id, item.type)"
                  class="text-left hover:opacity-80 transition-opacity"
                >
                  <div class="text-sm font-medium text-gray-900 dark:text-slate-100 hover:text-primary-600 dark:hover:text-primary-400">
                    {{ item.title }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400">
                    /{{ item.slug }}
                  </div>
                </button>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button
                  @click="toggleStatus(item)"
                  :disabled="togglingStatus === `${item.type}-${item.id}`"
                  :class="[
                    {
                      'bg-gradient-to-r from-amber-400 to-orange-500 text-white dark:from-amber-500 dark:to-orange-600 hover:from-amber-500 hover:to-orange-600 dark:hover:from-amber-600 dark:hover:to-orange-700 focus:ring-amber-500': item.status === 'draft',
                      'bg-gradient-to-r from-emerald-400 to-green-500 text-white dark:from-emerald-500 dark:to-green-600 hover:from-emerald-500 hover:to-green-600 dark:hover:from-emerald-600 dark:hover:to-green-700 focus:ring-emerald-500': item.status === 'published',
                    },
                    'px-4 py-2 text-xs font-semibold rounded-full cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg'
                  ]"
                  :title="`Click to toggle to ${item.status === 'draft' ? 'published' : 'draft'}`"
                >
                  <span v-if="togglingStatus === `${item.type}-${item.id}`" class="inline-flex items-center gap-1.5">
                    <svg class="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                  <span v-else class="inline-flex items-center gap-1.5">
                    <svg v-if="item.status === 'draft'" class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <span class="uppercase tracking-wide">{{ item.status }}</span>
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
                    class="text-cyan-600 dark:text-cyan-400 hover:text-cyan-900 dark:hover:text-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    class="text-cyan-600 dark:text-cyan-400 hover:text-cyan-900 dark:hover:text-cyan-300"
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
        <div v-if="items.length === 0 && !loading" class="text-center py-16">
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
            <h3 class="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-3">
              {{ searchQuery || statusFilter || typeFilter ? 'No content matches your filters' : 'No content yet' }}
            </h3>
            <p class="text-lg text-gray-600 dark:text-slate-400 mb-6">
              {{ searchQuery || statusFilter || typeFilter 
                ? 'Try adjusting your search or filter criteria to find content.' 
                : 'Get started by creating your first blog post or writing!' }}
            </p>
            <div v-if="searchQuery || statusFilter || typeFilter" class="mt-6">
              <button
                @click="clearFilters"
                class="inline-flex items-center px-6 py-3 border-2 border-cyan-600 dark:border-cyan-500 rounded-lg text-base font-medium text-cyan-600 dark:text-cyan-400 bg-white dark:bg-slate-900 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all shadow-sm hover:shadow-md"
              >
                Clear filters
              </button>
            </div>
            <div v-else class="mt-6">
              <button
                @click="openModal(null, 'blog')"
                class="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 dark:bg-cyan-700 text-white rounded-lg hover:bg-cyan-700 dark:hover:bg-cyan-600 transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 font-medium text-base"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Create Your First Post
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
      confirm-button-class="bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-700 dark:hover:bg-cyan-600"
      @confirm="executeDuplicate"
      @cancel="cancelDuplicate"
    />

  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
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

// Sorting state
const sortField = ref<'title' | 'updatedAt' | 'publishedAt' | 'status'>('updatedAt')
const sortDirection = ref<'asc' | 'desc'>('desc')

// Computed property for paginated items
const paginatedItems = computed(() => {
  if (!pagination.value) return items.value
  const start = (pagination.value.page - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  return items.value.slice(start, end)
})

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

const handleSort = (field: 'title' | 'updatedAt' | 'publishedAt' | 'status') => {
  if (sortField.value === field) {
    // Toggle direction if clicking the same field
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    // Set new field and default to descending
    sortField.value = field
    sortDirection.value = 'desc'
  }
  fetchContent()
}

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
  showNotification('success', 'Content saved successfully')
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

    // Fetch both blog posts and writings (no pagination - we do client-side pagination)
    const params = new URLSearchParams()
    if (searchQuery.value) params.append('q', searchQuery.value)
    if (statusFilter.value) params.append('status', statusFilter.value)
    // Fetch all items, we'll paginate client-side
    params.append('pageSize', '1000') // Get a large number to fetch all

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

    // Parse responses safely
    let blogData: any = { ok: true, posts: [], pagination: { total: 0 } }
    let writingData: any = { ok: true, writings: [], pagination: { total: 0 } }

    if (blogResponse) {
      if (!blogResponse.ok) {
        try {
          blogData = await blogResponse.json()
        } catch (e) {
          // Response is not JSON, use error message from status
          blogData = { 
            ok: false, 
            error: `Database error: Tables may not exist. Please run database migrations.`,
            message: `Server returned ${blogResponse.status} ${blogResponse.statusText}`
          }
        }
      } else {
        try {
          blogData = await blogResponse.json()
        } catch (e) {
          blogData = { ok: false, error: 'Invalid response from server' }
        }
      }
    }

    if (writingResponse) {
      if (!writingResponse.ok) {
        try {
          writingData = await writingResponse.json()
        } catch (e) {
          // Response is not JSON, use error message from status
          writingData = { 
            ok: false, 
            error: `Database error: Tables may not exist. Please run database migrations.`,
            message: `Server returned ${writingResponse.status} ${writingResponse.statusText}`
          }
        }
      } else {
        try {
          writingData = await writingResponse.json()
        } catch (e) {
          writingData = { ok: false, error: 'Invalid response from server' }
        }
      }
    }

    if ((blogResponse && (!blogResponse.ok || !blogData.ok)) || (writingResponse && (!writingResponse.ok || !writingData.ok))) {
      const errorMsg = blogData.error || writingData.error || blogData.message || writingData.message || 'Failed to fetch content'
      error.value = errorMsg
      // Still set empty arrays so the UI doesn't break
      items.value = []
      pagination.value = { page: 1, pageSize: 12, total: 0, totalPages: 1 }
      return
    }

    // Combine and add type identifier
    const combined = [
      ...(blogData.posts || []).map((post: any) => ({ ...post, type: 'blog' })),
      ...(writingData.writings || []).map((writing: any) => ({ ...writing, type: 'writing' })),
    ]

    // Sort based on current sort settings
    combined.sort((a, b) => {
      let aValue: any
      let bValue: any
      
      if (sortField.value === 'title') {
        aValue = (a.title || '').toLowerCase()
        bValue = (b.title || '').toLowerCase()
      } else if (sortField.value === 'status') {
        aValue = a.status || ''
        bValue = b.status || ''
      } else if (sortField.value === 'updatedAt') {
        aValue = new Date(a.updatedAt || 0).getTime()
        bValue = new Date(b.updatedAt || 0).getTime()
      } else if (sortField.value === 'publishedAt') {
        aValue = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
        bValue = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
      } else {
        aValue = new Date(a.updatedAt || 0).getTime()
        bValue = new Date(b.updatedAt || 0).getTime()
      }
      
      if (sortDirection.value === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
      }
    })

    items.value = combined
    const pageSize = 12
    const total = (blogData.pagination?.total || 0) + (writingData.pagination?.total || 0)
    pagination.value = {
      page: pagination.value?.page || 1,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
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
  // Scroll to top of table when changing pages
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  typeFilter.value = ''
  pagination.value = { ...pagination.value, page: 1 }
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
      // Ensure we preserve all fields and update with the response data
      const updatedItem = { 
        ...items.value[index], // Preserve existing fields
        ...updated, // Update with API response
        type: item.type // Ensure type is preserved
      }
      // If toggling to published and publishedAt is missing, set it now
      if (newStatus === 'published' && !updatedItem.publishedAt) {
        updatedItem.publishedAt = new Date().toISOString()
      }
      items.value[index] = updatedItem
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
      ? `/api/admin/blog/posts/${item.id}`
      : `/api/admin/writings/${item.id}`
    
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
  pagination.value = { page: 1, pageSize: 12, total: 0, totalPages: 1 }
  fetchContent()
})
</script>


