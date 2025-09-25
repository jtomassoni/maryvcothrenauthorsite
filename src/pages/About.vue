<template>
  <div class="py-16">
    <Container>
      <div class="max-w-4xl mx-auto">
        <!-- Page Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl lg:text-5xl font-serif font-bold gradient-text mb-6">
            About Mary
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            A deeper look into the life and work of an author who believes in the power of stories to connect us all.
          </p>
        </div>

        <!-- Main Content -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <!-- Text Content -->
          <div class="space-y-6 prose prose-lg max-w-none">
            <p class="text-gray-700 leading-relaxed">
              Mary's journey as a writer began in the quiet corners of libraries and the bustling energy of coffee shops. 
              With a background in literature and a passion for exploring the human condition, she crafts stories that 
              resonate with readers across generations.
            </p>
            
            <p class="text-gray-700 leading-relaxed">
              Her debut novel, "The Quiet Hour," was praised by critics for its "unforgettable characters and 
              masterful storytelling." Since then, she has continued to explore themes of family, memory, and 
              the places that shape us.
            </p>
            
            <p class="text-gray-700 leading-relaxed">
              When not writing, Mary can be found hiking local trails, experimenting with new recipes, or 
              curled up with a good book and her rescue dog, Luna. She believes that stories have the power 
              to heal, inspire, and bring people together.
            </p>
            
            <p class="text-gray-700 leading-relaxed">
              Mary holds an MFA in Creative Writing and has taught workshops at various universities and 
              writing centers. She is currently working on her next novel, which explores themes of 
              resilience and hope in the face of change.
            </p>
          </div>

          <!-- Photo Grid -->
          <div class="space-y-6">
            <div class="grid grid-cols-2 gap-4">
              <div class="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src="/src/assets/placeholder-mary.jpg"
                  alt="Mary at her writing desk"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src="/src/assets/placeholder-mary.jpg"
                  alt="Mary with her dog Luna"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
            <div class="aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden">
              <img
                src="/src/assets/placeholder-mary.jpg"
                alt="Mary at a book signing event"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="text-center mt-16">
          <router-link
            to="/"
            class="inline-flex items-center gap-2 bg-primary-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors focus-ring"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Home
          </router-link>
        </div>
      </div>
    </Container>
  </div>
</template>

<script setup lang="ts">
import Container from '@/components/Container.vue'
</script>
