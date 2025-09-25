<template>
  <div>
    <!-- Hero Section -->
    <Hero
      title="Mary V. Cothren — Nurse & Writer"
      subtitle="Mary V. Cothren is a nurse by night (yes, third shift) and writer by the light of day, or lamp. Mary is an experienced critical care and emergency nurse with over a decade in healthcare who has written many professional and academic papers, primarily for hospital quality improvement projects."
      cta-text="Read more →"
      cta-href="/about"
      image-src="/src/assets/placeholder-mary.svg"
      image-alt="Mary V. Cothren, nurse and writer"
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
