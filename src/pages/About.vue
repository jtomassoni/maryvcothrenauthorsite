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
            I learned at the early age of nine years that I could spell better than many of my classmates, acing all of my vocabulary tests. Then, by 19, in my first round of undergrad, my fellow students brought their papers to me for revisions. All that being said, I didn't believe that I was any better at writing or editing than others. My literature and writing career up to that point had been primarily reading SparkNotes and skipping class on the days we were to submit our written assignments; I had not even started mine.
          </p>
          
          <p class="text-gray-700 leading-relaxed">
            The only thing I had written, with any personally perceived success, was when I was 15, it was a "lengthy" 6-page paper in response to the vague prompt, "what led me to this [outlaw life]?" That assigned essay, which I titled "Soul Friend," was submitted to Colorado's 2nd District Juvenile Court and published in my now-expunged underage record. Maybe in some circles that counts as being a published author? Probably not.
          </p>
          
          <p class="text-gray-700 leading-relaxed">
            I no longer claim to be the teenage rebel without a cause, who suffered not only a home grounding, but a court date to which my fuming parents dragged me in my Sunday best in the middle of the work week. Rather, now, I am a nurse. I am also a writer. I am a traveler, a total foodie, a rock climber, and a professional dog park frequenter with my merry band of misfits. And the days of my juvenile delinquency are now the fuel for my mother's favorite stories to recount at social gatherings.
          </p>
          
          <p class="text-gray-700 leading-relaxed">
            As an adult, writing started as an outlet to navigate my personal demons of anxiety, depression, and PTSD related to being a nurse during the pandemic. However, these days, it has become an essential skill and pastime. Just as I would like to think that I have mastered the APA v.7 Style Guide (thank you, Purdue Owl) during my prolific professional and academic writing career in nursing, the rules change. Even when I believe I have nailed down the perfect sentence, the rules change.
          </p>
          
          <p class="text-gray-700 leading-relaxed">
            While I further my study of writing by taking courses on sentence structure, reading a memoir on the craft, or committing to memory Strunk & White's elements, the rules may be different, and the advice changes (except for the elimination of useless words and the blasphemous adverb). Through those, I have changed. I have evolved from a novice nurse to an educator and from a scribbler to a writer.
          </p>
          
          <p class="text-gray-700 leading-relaxed">
            I teach my new nurses that there are many means to the same end. I believe writing is also a means to an end of expression and connection. As I embark upon this new writing journey, I hope to connect with other writers and my readers. As a nurse, my audience is my patients and students, but here I hope that my audience will be you. I aim to grow as a professional writer and build a community with adventurous, creative, and pet-loving literaries. To quote my favorite author and adventurer, Jon Krakauer, "I now walk into the wild."
          </p>
        </div>

          <!-- Photo Grid -->
          <div class="space-y-6">
            <div class="grid grid-cols-2 gap-4">
              <div class="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src="/src/assets/placeholder-mary.svg"
                  alt="Mary at her writing desk"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src="/src/assets/placeholder-mary.svg"
                  alt="Mary with her dogs at the dog park"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
            <div class="aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden">
              <img
                src="/src/assets/placeholder-mary.svg"
                alt="Mary rock climbing or hiking"
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
