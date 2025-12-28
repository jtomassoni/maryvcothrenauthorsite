<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-70 p-4"
    @click.self="handleCancel"
  >
    <div
      class="bg-white dark:bg-slate-900 rounded-lg shadow-xl w-full max-w-md overflow-hidden"
    >
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
        <h2 class="text-xl font-bold text-gray-900 dark:text-slate-100">
          {{ title }}
        </h2>
        <p
          v-if="message"
          class="mt-2 text-sm text-gray-600 dark:text-slate-400"
        >
          {{ message }}
        </p>
      </div>

      <!-- Modal Footer -->
      <div
        class="px-6 py-4 border-t border-gray-200 dark:border-slate-700 flex items-center justify-end gap-3"
      >
        <button
          @click="handleCancel"
          class="px-4 py-2 text-sm border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded-md hover:bg-gray-50 dark:hover:bg-slate-800 dark:bg-slate-900 transition-colors"
        >
          {{ cancelText }}
        </button>
        <button
          @click="handleConfirm"
          :class="confirmButtonClass"
          class="px-4 py-2 text-sm text-white rounded-md transition-colors shadow-sm dark:shadow-md"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const props = withDefaults(
  defineProps<{
    isOpen: boolean
    title: string
    message?: string
    confirmText?: string
    cancelText?: string
    confirmButtonClass?: string
  }>(),
  {
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmButtonClass:
      'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600',
  }
)

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}

const handleKeydown = (e: KeyboardEvent) => {
  if (!props.isOpen) return

  if (e.key === 'Escape') {
    e.preventDefault()
    handleCancel()
  } else if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
    e.preventDefault()
    handleConfirm()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>
