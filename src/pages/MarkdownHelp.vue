<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-950 py-8">
    <Container>
      <div class="max-w-4xl mx-auto">
        <div class="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">Markdown Formatting Guide</h1>
          <p class="text-gray-600 dark:text-slate-400 mb-8">
            A quick reference guide for writing markdown content
          </p>

          <div class="space-y-8 text-sm text-gray-700 dark:text-slate-300">
            <!-- Headers -->
            <section>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-3">Headers</h2>
              <div class="bg-gray-50 dark:bg-slate-800 p-4 rounded font-mono text-xs space-y-1">
                <div># H1 Header</div>
                <div>## H2 Header</div>
                <div>### H3 Header</div>
                <div>#### H4 Header</div>
                <div>##### H5 Header</div>
                <div>###### H6 Header</div>
              </div>
            </section>

            <!-- Emphasis -->
            <section>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-3">Emphasis</h2>
              <div class="bg-gray-50 dark:bg-slate-800 p-4 rounded font-mono text-xs space-y-1">
                <div>*italic* or _italic_</div>
                <div>**bold** or __bold__</div>
                <div>***bold italic***</div>
                <div>~~strikethrough~~</div>
              </div>
            </section>

            <!-- Lists -->
            <section>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-3">Lists</h2>
              <div class="bg-gray-50 dark:bg-slate-800 p-4 rounded font-mono text-xs space-y-2">
                <div class="font-semibold">Unordered list:</div>
                <div class="ml-2">- Item 1</div>
                <div class="ml-2">- Item 2</div>
                <div class="ml-2">  - Nested item</div>
                <div class="mt-3 font-semibold">Ordered list:</div>
                <div class="ml-2">1. First item</div>
                <div class="ml-2">2. Second item</div>
                <div class="ml-2">3. Third item</div>
              </div>
            </section>

            <!-- Links -->
            <section>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-3">Links</h2>
              <div class="bg-gray-50 dark:bg-slate-800 p-4 rounded font-mono text-xs space-y-1">
                <div>[Link text](https://example.com)</div>
                <div>[Link with title](https://example.com "Title text")</div>
                <div>&lt;https://example.com&gt; (automatic link)</div>
              </div>
            </section>

            <!-- Images -->
            <section>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-3">Images</h2>
              <div class="bg-gray-50 dark:bg-slate-800 p-4 rounded font-mono text-xs space-y-1">
                <div>![Alt text](image-url.jpg)</div>
                <div>![Alt text](image-url.jpg "Image title")</div>
                <div>![Alt text][image-reference]</div>
                <div class="mt-2 text-xs text-gray-500 dark:text-slate-400">[image-reference]: image-url.jpg "Title"</div>
              </div>
            </section>

            <!-- Code -->
            <section>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-3">Code</h2>
              <div class="bg-gray-50 dark:bg-slate-800 p-4 rounded font-mono text-xs space-y-2">
                <div>Inline code: `code here`</div>
                <div class="mt-2">Code block:</div>
                <div class="ml-2">```language</div>
                <div class="ml-2">code here</div>
                <div class="ml-2">more code</div>
                <div class="ml-2">```</div>
                <div class="mt-2 text-xs text-gray-500 dark:text-slate-400">(language is optional: js, python, html, etc.)</div>
              </div>
            </section>

            <!-- Blockquotes -->
            <section>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-3">Blockquotes</h2>
              <div class="bg-gray-50 dark:bg-slate-800 p-4 rounded font-mono text-xs space-y-1">
                <div>&gt; This is a quote</div>
                <div>&gt; Multiple lines</div>
                <div>&gt; </div>
                <div>&gt; With paragraph breaks</div>
              </div>
            </section>

            <!-- Horizontal Rule -->
            <section>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-3">Horizontal Rule</h2>
              <div class="bg-gray-50 dark:bg-slate-800 p-4 rounded font-mono text-xs space-y-1">
                <div>---</div>
                <div>or</div>
                <div>***</div>
                <div>or</div>
                <div>___</div>
              </div>
            </section>

            <!-- Line Breaks -->
            <section>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-3">Line Breaks</h2>
              <div class="bg-gray-50 dark:bg-slate-800 p-4 rounded text-xs space-y-1">
                <div>End a line with two spaces for a line break</div>
                <div class="mt-2">Or use a blank line for a paragraph break</div>
              </div>
            </section>

            <!-- Tables -->
            <section>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-3">Tables</h2>
              <div class="bg-gray-50 dark:bg-slate-800 p-4 rounded font-mono text-xs space-y-1">
                <div>| Header 1 | Header 2 |</div>
                <div>|----------|----------|</div>
                <div>| Cell 1   | Cell 2   |</div>
                <div>| Cell 3   | Cell 4   |</div>
              </div>
            </section>

            <!-- Task Lists -->
            <section>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-3">Task Lists</h2>
              <div class="bg-gray-50 dark:bg-slate-800 p-4 rounded font-mono text-xs space-y-1">
                <div>- [ ] Unchecked task</div>
                <div>- [x] Checked task</div>
              </div>
            </section>
          </div>

          <div class="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
            <p class="text-sm text-gray-600 dark:text-slate-400">
              For more detailed information, visit the <a href="https://www.markdownguide.org/" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">Markdown Guide</a>.
            </p>
          </div>
        </div>
      </div>
    </Container>
  </div>
</template>

<script setup lang="ts">
import Container from '@/components/Container.vue'
</script>

