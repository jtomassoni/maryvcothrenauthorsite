<template>
  <div class="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
    <Container>
      <div class="max-w-4xl mx-auto">
        <!-- Page Header -->
        <div class="text-center mb-12">
          <h1
            class="text-4xl lg:text-5xl font-serif font-bold gradient-text dark:bg-gradient-to-r dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 dark:bg-clip-text dark:text-transparent mb-6"
          >
            About Mary
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A deeper look into the life and work of an author who believes in
            the power of stories to connect us all.
          </p>
        </div>

        <!-- Main Content -->
        <div class="space-y-8">
          <!-- Photo Section -->
          <div class="relative">
            <div class="lg:w-1/3 lg:float-left lg:mr-8 lg:mb-4">
              <div
                class="aspect-square lg:aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden"
              >
                <img
                  :src="aboutPageImage"
                  alt="Mary V. Cothren, nurse and writer"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>

            <div class="prose prose-lg max-w-none">
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                I learned at the early age of nine years that I could spell
                better than many of my classmates, acing all of my vocabulary
                tests. Then, by 19, in my first round of undergrad, my fellow
                students brought their papers to me for revisions. All that
                being said, I didn't believe that I was any better at writing or
                editing than others. My literature and writing career up to that
                point had been primarily reading SparkNotes and skipping class
                on the days we were to submit our written assignments; I had not
                even started mine.
              </p>

              <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                The only thing I had written, with any personally perceived
                success, was when I was 15; it was a "lengthy" 6-page paper in
                response to the vague prompt, "what led me to this [outlaw
                life]?" That assigned essay, which I titled "Soul Friend," was
                submitted to Colorado's 2nd District Juvenile Court and
                published in my now-expunged underage record. Maybe in some
                circles that counts as being a published author? Probably not.
              </p>

              <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                I no longer claim to be the teenage rebel without a cause, who
                suffered not only a home grounding, but a court date to which my
                fuming parents dragged me in my Sunday best in the middle of the
                work week. Rather, now, I am a nurse. I am also a writer. I am a
                traveler, a total foodie, a rock climber, and a professional dog
                park frequenter with my merry band of misfits. And the days of
                my juvenile delinquency are now the fuel for my mother's
                favorite stories to recount at social gatherings.
              </p>

              <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                As an adult, writing started as an outlet to navigate my
                personal demons of anxiety, depression, and PTSD related to
                being a nurse during the pandemic. However, these days, it has
                become an essential skill and pastime. Just as I would like to
                think that I have mastered the APA v.7 Style Guide (thank you,
                Purdue Owl) during my prolific professional and academic writing
                career in nursing, the rules change. Even when I believe I have
                nailed down the perfect sentence, the rules change.
              </p>
            </div>
          </div>

          <!-- Second Photo Section -->
          <div class="relative clear-right">
            <div class="lg:w-1/3 lg:float-right lg:ml-8 lg:mb-4">
              <div
                class="aspect-square lg:aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden"
              >
                <img
                  :src="aboutPageImage3"
                  alt="Mary V. Cothren"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>

            <div class="prose prose-lg max-w-none">
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                While I further my study of writing by taking courses on
                sentence structure, reading a memoir on the craft, or committing
                to memory Strunk & White's elements, the rules may be different,
                and the advice changes (except for the elimination of useless
                words and the blasphemous adverb). Through those, I have
                changed. I have evolved from a novice nurse to an educator and
                from a scribbler to a writer.
              </p>

              <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                I teach my new nurses that there are many means to the same end.
                I believe writing is also a means to an end of expression and
                connection. As I embark upon this new writing journey, I hope to
                connect with other writers and my readers. As a nurse, my
                audience is my patients and students, but here I hope that my
                audience will be you. I aim to grow as a professional writer and
                build a community with adventurous, creative, and pet-loving
                literaries. To quote my favorite author and adventurer, Jon
                Krakauer, "I now walk into the wild."
              </p>
            </div>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="text-center mt-16">
          <button
            @click="scrollToContact"
            class="inline-flex items-center gap-2 bg-gradient-to-r from-primary-800 to-primary-700 dark:from-blue-600 dark:to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-primary-700 hover:to-primary-600 dark:hover:from-blue-500 dark:hover:to-purple-500 transition-all duration-300 focus-ring shadow-lg dark:shadow-blue-500/30"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              ></path>
            </svg>
            Join the Mailing List
          </button>
        </div>
      </div>
    </Container>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Container from '@/components/Container.vue'
import aboutPageImage from '@/assets/mary-about-page.png'
import aboutPageImage3 from '@/assets/mary-about-page-3.png'

const router = useRouter()

const scrollToContact = async () => {
  // Navigate to home page first
  await router.push('/')

  // Wait for the page to load, then scroll to contact section
  setTimeout(() => {
    const contactElement = document.getElementById('contact')
    if (contactElement) {
      contactElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, 100)
}
</script>
