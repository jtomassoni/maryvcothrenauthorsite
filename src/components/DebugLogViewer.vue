<template>
  <div
    v-if="isOpen"
    class="fixed bottom-4 right-4 z-[100] w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg shadow-2xl flex flex-col max-h-[600px]"
  >
    <!-- Header -->
    <div class="px-4 py-3 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between bg-gray-50 dark:bg-slate-800">
      <div class="flex items-center gap-2">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-slate-100">Debug Logs</h3>
        <span class="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded">
          {{ logs.length }}
        </span>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="clearLogs"
          class="px-2 py-1 text-xs text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 transition-colors"
          title="Clear logs"
        >
          Clear
        </button>
        <button
          @click="toggleOpen"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          title="Close"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Logs Container -->
    <div class="flex-1 overflow-y-auto p-2 space-y-1 font-mono text-xs">
      <div
        v-for="(log, index) in logs"
        :key="index"
        :class="{
          'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30 text-red-800 dark:text-red-200': log.type === 'error',
          'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900/30 text-yellow-800 dark:text-yellow-200': log.type === 'warn',
          'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/30 text-blue-800 dark:text-blue-200': log.type === 'info',
          'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200': log.type === 'log',
        }"
        class="p-2 rounded border break-words"
      >
        <div class="flex items-start gap-2">
          <span class="font-semibold text-[10px] uppercase flex-shrink-0">
            {{ log.type }}
          </span>
          <span class="text-[10px] text-gray-500 dark:text-gray-400 flex-shrink-0">
            {{ formatTime(log.timestamp) }}
          </span>
        </div>
        <div class="mt-1">
          <div v-if="typeof log.message === 'string'">{{ log.message }}</div>
          <pre v-else class="whitespace-pre-wrap text-[10px]">{{ JSON.stringify(log.message, null, 2) }}</pre>
          <div v-if="log.stack" class="mt-1 text-[10px] opacity-75">
            {{ log.stack }}
          </div>
        </div>
      </div>
      <div v-if="logs.length === 0" class="text-center py-8 text-gray-500 dark:text-slate-400 text-xs">
        No logs yet
      </div>
    </div>

    <!-- Footer -->
    <div class="px-4 py-2 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 flex items-center justify-between">
      <label class="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-400">
        <input
          v-model="autoScroll"
          type="checkbox"
          class="rounded"
        />
        Auto-scroll
      </label>
      <button
        @click="copyLogs"
        class="px-2 py-1 text-xs text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 transition-colors"
        title="Copy logs to clipboard"
      >
        {{ copyButtonText }}
      </button>
    </div>
  </div>

  <!-- Toggle Button (when closed) -->
  <button
    v-else
    @click="toggleOpen"
    class="fixed bottom-4 right-4 z-[100] w-12 h-12 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
    title="Show debug logs"
  >
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
    <span
      v-if="logs.length > 0"
      class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold"
    >
      {{ logs.length > 99 ? '99+' : logs.length }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'

interface LogEntry {
  type: 'log' | 'error' | 'warn' | 'info'
  message: any
  timestamp: number
  stack?: string
}

const isOpen = ref(false)
const logs = ref<LogEntry[]>([])
const autoScroll = ref(true)
const maxLogs = 500
const copyButtonText = ref('Copy')

const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn,
  info: console.info,
}

const addLog = (type: 'log' | 'error' | 'warn' | 'info', ...args: any[]) => {
  const message = args.length === 1 ? args[0] : args
  const entry: LogEntry = {
    type,
    message,
    timestamp: Date.now(),
  }

  // Extract stack trace for errors
  if (type === 'error' && args[0] instanceof Error) {
    entry.stack = args[0].stack
    entry.message = args[0].message
  }

  logs.value.push(entry)

  // Limit log size
  if (logs.value.length > maxLogs) {
    logs.value = logs.value.slice(-maxLogs)
  }

  // Auto-scroll if enabled
  if (autoScroll.value && isOpen.value) {
    nextTick(() => {
      const container = document.querySelector('.overflow-y-auto')
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    })
  }

  // Also call original console method
  originalConsole[type](...args)
}

const interceptConsole = () => {
  console.log = (...args: any[]) => addLog('log', ...args)
  console.error = (...args: any[]) => addLog('error', ...args)
  console.warn = (...args: any[]) => addLog('warn', ...args)
  console.info = (...args: any[]) => addLog('info', ...args)
}

const restoreConsole = () => {
  console.log = originalConsole.log
  console.error = originalConsole.error
  console.warn = originalConsole.warn
  console.info = originalConsole.info
}

const interceptFetch = () => {
  const originalFetch = window.fetch
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
    const method = init?.method || 'GET'
    
    addLog('info', `Fetch: ${method} ${url}`)
    
    try {
      const response = await originalFetch(input, init)
      
      // Clone response to read body without consuming it
      const clonedResponse = response.clone()
      
      // Log response status
      if (!response.ok) {
        try {
          let errorData
          try {
            errorData = await clonedResponse.json()
          } catch (jsonError) {
            errorData = { text: await clonedResponse.text() }
          }
          addLog('error', `Fetch Error: ${method} ${url} - ${response.status} ${response.statusText}`, errorData)
        } catch (e) {
          addLog('error', `Fetch Error: ${method} ${url} - ${response.status} ${response.statusText}`)
        }
      } else {
        addLog('info', `Fetch Success: ${method} ${url} - ${response.status}`)
      }
      
      return response
    } catch (error) {
      addLog('error', `Fetch Exception: ${method} ${url}`, error)
      throw error
    }
  }
}

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  const timeString = date.toLocaleTimeString('en-US', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
  const milliseconds = date.getMilliseconds().toString().padStart(3, '0')
  return `${timeString}.${milliseconds}`
}

const toggleOpen = () => {
  isOpen.value = !isOpen.value
}

const clearLogs = () => {
  logs.value = []
}

const copyLogs = async () => {
  const logText = logs.value.map(log => {
    const time = formatTime(log.timestamp)
    const message = typeof log.message === 'string' 
      ? log.message 
      : JSON.stringify(log.message, null, 2)
    return `[${time}] ${log.type.toUpperCase()}: ${message}${log.stack ? '\n' + log.stack : ''}`
  }).join('\n\n')
  
  try {
    await navigator.clipboard.writeText(logText)
    copyButtonText.value = 'Copied!'
    setTimeout(() => {
      copyButtonText.value = 'Copy'
    }, 2000)
  } catch (err) {
    console.error('Failed to copy logs:', err)
    copyButtonText.value = 'Failed'
    setTimeout(() => {
      copyButtonText.value = 'Copy'
    }, 2000)
  }
}

// Watch for errors
const handleError = (event: ErrorEvent) => {
  addLog('error', `Uncaught Error: ${event.message}`, {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  })
  if (event.error?.stack) {
    addLog('error', `Stack: ${event.error.stack}`)
  }
}

const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
  addLog('error', `Unhandled Promise Rejection:`, event.reason)
  if (event.reason?.stack) {
    addLog('error', `Stack: ${event.reason.stack}`)
  }
}

onMounted(() => {
  interceptConsole()
  interceptFetch()
  window.addEventListener('error', handleError)
  window.addEventListener('unhandledrejection', handleUnhandledRejection)
  
  // Only show in admin area or if explicitly enabled
  const isAdmin = window.location.pathname.startsWith('/admin')
  if (isAdmin) {
    // Auto-open if there are errors
    setTimeout(() => {
      if (logs.value.some(log => log.type === 'error')) {
        isOpen.value = true
      }
    }, 1000)
  }
})

onUnmounted(() => {
  restoreConsole()
  window.removeEventListener('error', handleError)
  window.removeEventListener('unhandledrejection', handleUnhandledRejection)
})
</script>

