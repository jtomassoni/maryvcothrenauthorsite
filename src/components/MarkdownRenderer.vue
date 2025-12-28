<template>
  <div 
    class="prose prose-lg dark:prose-invert max-w-none"
    v-html="sanitizedHtml"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const props = defineProps<{
  content: string
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
      'p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'blockquote',
      'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'hr',
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class'],
    ALLOW_DATA_ATTR: false,
  })
})
</script>

