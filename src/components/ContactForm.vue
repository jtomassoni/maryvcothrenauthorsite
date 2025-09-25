<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/50 p-8 border dark:border-gray-700">
    <div class="text-center mb-8">
      <h2 class="text-2xl lg:text-3xl font-serif font-bold gradient-text dark:bg-gradient-to-r dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 dark:bg-clip-text dark:text-transparent mb-4">
        {{ title }}
      </h2>
      <p class="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        {{ description }}
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Name Field -->
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Name <span class="text-red-500">*</span>
        </label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 dark:focus:ring-blue-400 focus:border-accent-300 dark:focus:border-blue-400 focus-ring bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          placeholder="Your name"
          :aria-describedby="errors.name ? 'name-error' : undefined"
          :aria-invalid="!!errors.name"
        />
        <div v-if="errors.name" id="name-error" class="mt-1 text-sm text-red-600" role="alert">
          {{ errors.name }}
        </div>
      </div>

      <!-- Email Field -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Email <span class="text-red-500">*</span>
        </label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 dark:focus:ring-blue-400 focus:border-accent-300 dark:focus:border-blue-400 focus-ring bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          placeholder="your@email.com"
          :aria-describedby="errors.email ? 'email-error' : undefined"
          :aria-invalid="!!errors.email"
        />
        <div v-if="errors.email" id="email-error" class="mt-1 text-sm text-red-600" role="alert">
          {{ errors.email }}
        </div>
      </div>

      <!-- Message Field (Optional) -->
      <div v-if="!compact">
        <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
          Message
        </label>
        <textarea
          id="message"
          v-model="form.message"
          rows="4"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-300 focus-ring"
          placeholder="Your message (optional)"
        ></textarea>
      </div>

      <!-- Honeypot Field (Hidden) -->
      <input
        v-model="form.honeypot"
        type="text"
        name="website"
        style="display: none"
        tabindex="-1"
        autocomplete="off"
      />

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="isSubmitting"
        class="w-full bg-gradient-to-r from-primary-800 to-primary-700 dark:from-blue-600 dark:to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-primary-700 hover:to-primary-600 dark:hover:from-blue-500 dark:hover:to-purple-500 transition-all duration-300 focus-ring disabled:opacity-50 disabled:cursor-not-allowed shadow-lg dark:shadow-blue-500/30"
      >
        <span v-if="!isSubmitting">
          {{ submitText }}
        </span>
        <span v-else class="flex items-center justify-center gap-2">
          <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Sending...
        </span>
      </button>
    </form>

    <!-- Success/Error Messages -->
    <div v-if="successMessage" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg" role="alert">
      <div class="flex">
        <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
        <div class="ml-3">
          <p class="text-sm font-medium text-green-800">{{ successMessage }}</p>
        </div>
      </div>
    </div>

    <div v-if="errorMessage" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
      <div class="flex">
        <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
        </svg>
        <div class="ml-3">
          <p class="text-sm font-medium text-red-800">{{ errorMessage }}</p>
        </div>
      </div>
    </div>

    <p class="text-xs text-gray-500 text-center mt-4">
      We respect your privacy. Your information will not be shared.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

interface Props {
  title?: string
  description?: string
  submitText?: string
  compact?: boolean
}

withDefaults(defineProps<Props>(), {
  title: 'Join My Mailing List',
  description: 'Get updates on new releases, events, and exclusive content delivered to your inbox.',
  submitText: 'Subscribe',
  compact: false
})

const form = reactive({
  name: '',
  email: '',
  message: '',
  honeypot: ''
})

const errors = reactive({
  name: '',
  email: ''
})

const isSubmitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const validateForm = () => {
  // Clear previous errors
  errors.name = ''
  errors.email = ''

  let isValid = true

  // Validate name
  if (!form.name.trim()) {
    errors.name = 'Name is required'
    isValid = false
  }

  // Validate email
  if (!form.email.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  // Clear previous messages
  successMessage.value = ''
  errorMessage.value = ''

  // Check honeypot
  if (form.honeypot) {
    return // Bot detected, silently ignore
  }

  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      }),
    })

    const data = await response.json()

    if (data.ok) {
      successMessage.value = 'Thank you for subscribing! You\'ll hear from me soon.'
      // Reset form
      form.name = ''
      form.email = ''
      form.message = ''
    } else {
      errorMessage.value = data.error || 'Something went wrong. Please try again.'
    }
  } catch (error) {
    console.error('Form submission error:', error)
    errorMessage.value = 'Network error. Please check your connection and try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
