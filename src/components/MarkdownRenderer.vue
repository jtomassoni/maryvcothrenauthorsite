<template>
  <div
    :class="[
      'prose dark:prose-invert max-w-none prose-a:text-primary-800 prose-a:dark:text-blue-400 prose-a:hover:text-primary-700 prose-a:dark:hover:text-blue-300 prose-a:underline',
      size === 'sm' ? 'prose-sm' : size === 'base' ? 'prose-base' : 'prose-lg',
    ]"
    v-html="sanitizedHtml"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const props = defineProps<{
  content: string
  size?: 'sm' | 'base' | 'lg'
}>()

const sanitizedHtml = computed(() => {
  if (!props.content) return ''

  // Convert markdown to HTML with options
  const html = marked.parse(props.content, {
    breaks: true,
    gfm: true,
  }) as string

  // Sanitize HTML to prevent XSS
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p',
      'br',
      'strong',
      'em',
      'u',
      's',
      'code',
      'pre',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'ul',
      'ol',
      'li',
      'blockquote',
      'a',
      'img',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
      'hr',
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class'],
    ALLOW_DATA_ATTR: false,
  })
})
</script>
