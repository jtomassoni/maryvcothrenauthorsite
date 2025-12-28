<template>
  <div>
    <!-- Hero Section -->
    <Hero
      title="Mary V. Cothren"
      subheading="Nurse & Writer"
      subtitle="Mary V. Cothren is a nurse by night (yes, third shift) and writer by the light of day, or lamp. Mary is an experienced critical care and emergency nurse with over a decade in healthcare who has written many professional and academic papers, primarily for hospital quality improvement projects. While unpublished, her writing has evolved from her first printed Mother's Day greeting card at the age of 5 years (her mother still has it framed) to memoir, creative nonfiction, and poetry. She is currently working on the manuscript of her memoir as a COVID nurse during the pandemic and preparing several other pieces for literary submission. With active participation in writing communities (Writers.com and Authors Publish) and her upcoming blog, Salt & Stethoscopes, she hopes to build a community of fellow writers, adventurers, and foodies (nurses are invited, too)."
      cta-text="Read more →"
      cta-href="/about"
      :image-src="homePageImage"
      image-alt="Mary V. Cothren, nurse and writer"
      image-overlay-text="About Mary"
    />

    <!-- Latest Posts Section -->
    <section class="py-6 lg:py-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <Container>
        <div class="text-center mb-6">
          <h2 class="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-2">
            Latest
          </h2>
          <p class="text-base text-gray-700 dark:text-gray-300">
            Recent thoughts and updates
          </p>
        </div>

        <!-- Loading -->
        <div v-if="loadingPosts" class="text-center py-8">
          <p class="text-gray-600 dark:text-gray-400">Loading posts...</p>
        </div>

        <!-- Items Grid -->
        <div v-else-if="latestItems.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4 mb-4">
          <article
            v-for="(item, index) in latestItems"
            :key="`${item.type}-${item.id}`"
            class="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-opacity-50"
            :class="{
              'hover:border-blue-300 dark:hover:border-blue-600': index === 0,
              'hover:border-purple-300 dark:hover:border-purple-600': index === 1,
              'hover:border-pink-300 dark:hover:border-pink-600': index === 2,
            }"
          >
            <!-- Colorful top border accent -->
            <div 
              class="h-1 w-full"
              :class="{
                'bg-gradient-to-r from-blue-500 to-blue-600': index === 0,
                'bg-gradient-to-r from-purple-500 to-purple-600': index === 1,
                'bg-gradient-to-r from-pink-500 to-pink-600': index === 2,
              }"
            ></div>
            
            <div class="p-3 lg:p-4">
              <div class="mb-2 flex items-center gap-2 flex-wrap">
                <span
                  class="inline-block px-3 py-1 text-xs font-semibold rounded-full shadow-sm"
                  :class="{
                    'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200': item.type === 'blog',
                    'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200': item.type === 'writing',
                  }"
                >
                  {{ item.type === 'blog' ? 'Blog' : 'Writing' }}
                </span>
                <span
                  v-for="(tag, tagIndex) in (item.tags || []).slice(0, 2)"
                  :key="tag"
                  class="inline-block px-2.5 py-1 text-xs font-medium rounded-full"
                  :class="{
                    'bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 dark:from-cyan-900/30 dark:to-blue-900/30 dark:text-cyan-300': tagIndex === 0,
                    'bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 dark:from-pink-900/30 dark:to-rose-900/30 dark:text-pink-300': tagIndex === 1,
                  }"
                >
                  {{ tag }}
                </span>
              </div>
              <h3 class="text-lg font-bold mb-1.5 group-hover:scale-105 transition-transform duration-200">
                <router-link
                  :to="item.type === 'blog' ? `/blog/${item.slug}` : `/writings/${item.slug}`"
                  class="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent hover:from-blue-600 hover:to-purple-600 dark:hover:from-blue-400 dark:hover:to-purple-400 transition-all duration-300"
                >
                  {{ item.title }}
                </router-link>
              </h3>
              <p class="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">
                {{ formatDate(item.publishedAt || item.createdAt) }}
              </p>
              <p class="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 mb-3 leading-relaxed">
                {{ item.excerpt }}
              </p>
              <router-link
                :to="item.type === 'blog' ? `/blog/${item.slug}` : `/writings/${item.slug}`"
                class="inline-flex items-center gap-2 font-semibold transition-all duration-300 group-hover:gap-3"
                :class="{
                  'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300': index === 0,
                  'text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300': index === 1,
                  'text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300': index === 2,
                }"
              >
                Read more
                <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </router-link>
            </div>
          </article>
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-8">
          <p class="text-gray-600 dark:text-gray-400">No content yet. Check back soon!</p>
        </div>

        <!-- View More Buttons -->
        <div v-if="latestItems.length > 0" class="text-center flex gap-4 justify-center flex-wrap">
          <router-link
            to="/blog"
            class="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            View All Blog Posts
            <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
          <router-link
            to="/writings"
            class="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            View All Writings
            <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
        </div>
      </Container>
    </section>

    <!-- Contact Form Section -->
    <section id="contact" class="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
      <Container>
        <div class="max-w-2xl mx-auto">
          <ContactForm
            title="Join My Mailing List"
            description="Get updates on new releases, events, and exclusive content delivered to your inbox."
            submit-text="Subscribe"
            :compact="true"
          />
        </div>
      </Container>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Hero from '@/components/Hero.vue'
import ContactForm from '@/components/ContactForm.vue'
import Container from '@/components/Container.vue'
import homePageImage from '@/assets/home-page-mary-pic.png'

const latestItems = ref<any[]>([])
const loadingPosts = ref(false)

const fetchLatestItems = async () => {
  loadingPosts.value = true
  try {
    const response = await fetch('/api/latest?limit=3')
    const data = await response.json()
    
    if (data.ok && data.items) {
      latestItems.value = data.items
    }
  } catch (error) {
    console.error('Error fetching latest items:', error)
  } finally {
    loadingPosts.value = false
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(() => {
  fetchLatestItems()
})
</script>
