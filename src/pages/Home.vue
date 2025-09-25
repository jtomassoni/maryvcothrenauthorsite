<template>
  <div>
    <!-- Hero Section -->
    <Hero
      title="Mary — Writer & Storyteller"
      subtitle="Award-winning author whose novels explore the intersection of family, memory, and place. Her work has been praised for its lyrical prose and deep emotional resonance."
      cta-text="Read more →"
      cta-href="/about"
      image-src="/src/assets/placeholder-mary.jpg"
      image-alt="Mary, author and storyteller"
      image-overlay-text="About Mary"
    />

    <!-- Contact Form Section -->
    <section id="contact" class="py-16 bg-white">
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
import Hero from '@/components/Hero.vue'
import ContactForm from '@/components/ContactForm.vue'
import Container from '@/components/Container.vue'
</script>
