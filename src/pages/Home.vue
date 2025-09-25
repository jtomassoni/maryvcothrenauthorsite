<template>
  <div>
    <!-- Hero Section -->
    <Hero
      title="Mary V. Cothren — Nurse & Writer"
      subtitle="Mary V. Cothren is a nurse by night (yes, third shift) and writer by the light of day, or lamp. Mary is an experienced critical care and emergency nurse with over a decade in healthcare who has written many professional and academic papers, primarily for hospital quality improvement projects. While unpublished, her writing has evolved from her first printed Mother’s Day greeting card at the age of 5 years (her mother still has it framed) to memoir, creative nonfiction, and poetry. She is currently working on the manuscript of her memoir as a COVID nurse during the pandemic and preparing several other pieces for literary submission. With active participation in writing communities (Writers.com and Authors Publish) and her upcoming blog, Salt & Stethoscopes, she hopes to build a community of fellow writers, adventurers, and foodies (nurses are invited, too)."
      cta-text="Read more →"
      cta-href="/about"
      image-src="/src/assets/home-page-mary-pic.png"
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
