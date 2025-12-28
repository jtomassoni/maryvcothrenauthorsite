<template>
  <div class="py-16">
    <Container>
      <div class="max-w-4xl mx-auto">
        <!-- Page Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl lg:text-5xl font-serif font-bold gradient-text mb-6">
            Contact
          </h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Have a question or want to connect? I'd love to hear from you.
          </p>
        </div>

        <!-- Contact Form -->
        <div class="max-w-2xl mx-auto mb-16">
          <ContactForm
            title="Get In Touch"
            description="Send me a message and I'll get back to you as soon as possible."
            submit-text="Send Message"
            :compact="true"
          />
        </div>

        <!-- Contact Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <!-- Contact Details -->
          <div class="space-y-6">
            <h2 class="text-2xl font-serif font-bold text-gray-800 mb-6">
              Other Ways to Connect
            </h2>
            
            <div class="space-y-4">    
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">Location</h3>
                  <p class="text-gray-600">Based in Denver, Colorado</p>
                  <p class="text-primary-600 font-medium">Denver, Colorado</p>
                </div>
              </div>
              
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">Response Time</h3>
                  <p class="text-gray-600">I typically respond within</p>
                  <p class="text-primary-600 font-medium">24-48 hours</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Additional Info -->
          <div class="space-y-6">
            <h2 class="text-2xl font-serif font-bold text-gray-800 mb-6">
              What I'm Looking For
            </h2>
            
            <div class="space-y-4">
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-800 mb-2">Speaking Engagements</h3>
                <p class="text-gray-600 text-sm">Book clubs, writing workshops, and literary events</p>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-800 mb-2">Collaboration</h3>
                <p class="text-gray-600 text-sm">Literary projects, anthologies, and creative partnerships</p>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-semibold text-gray-800 mb-2">Media Inquiries</h3>
                <p class="text-gray-600 text-sm">Interviews, features, and press opportunities</p>
              </div>
            </div>

            <!-- Newsletter CTA -->
            <div class="bg-primary-50 rounded-lg p-6">
              <h3 class="font-semibold text-gray-800 mb-2">Stay Updated</h3>
              <p class="text-gray-600 text-sm mb-4">
                Join my mailing list for the latest news, events, and exclusive content.
              </p>
              <router-link
                to="/#contact"
                class="inline-flex items-center gap-2 bg-primary-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors focus-ring text-sm"
              >
                Join Mailing List
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </Container>
  </div>
</template>

<script setup lang="ts">
import Container from '@/components/Container.vue'
import ContactForm from '@/components/ContactForm.vue'
</script>
