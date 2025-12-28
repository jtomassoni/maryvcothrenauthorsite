<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-950 py-8">
    <Container>
      <div class="max-w-4xl mx-auto">
        <div class="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">
            Markdown Formatting Guide
          </h1>
          <p class="text-gray-600 dark:text-slate-400 mb-8">
            A quick reference guide for writing your nursing stories, writings,
            and reflections
          </p>

          <div class="space-y-8 text-sm text-gray-700 dark:text-slate-300">
            <!-- Headers -->
            <section>
              <h2
                class="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-3"
              >
                Headers
              </h2>
              <p class="text-sm text-gray-600 dark:text-slate-400 mb-2">
                Use headers to structure your nursing stories and organize your
                content.
              </p>
              <div
                class="bg-gray-50 dark:bg-slate-800 p-4 rounded font-mono text-xs space-y-1"
              >
                <div># Reflections on Night Shift</div>
                <div>## Patient Care Experiences</div>
                <div>### Lessons Learned</div>
                <div>#### Key Takeaways</div>
              </div>
            </section>

            <!-- Emphasis -->
            <section>
              <h2
                class="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-3"
              >
                Emphasis
              </h2>
              <p class="text-sm text-gray-600 dark:text-slate-400 mb-2">
                Highlight important nursing concepts, protocols, or emotional
                moments.
              </p>
              <div
                class="bg-gray-50 dark:bg-slate-800 p-4 rounded font-mono text-xs space-y-1"
              >
                <div>*gentle reminder* or _personal reflection_</div>
                <div>**critical care protocol** or __important note__</div>
                <div>***urgent patient need***</div>
              </div>
            </section>

            <!-- Lists -->
            <section>
              <h2
                class="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-3"
              >
                Lists
              </h2>
              <p class="text-sm text-gray-600 dark:text-slate-400 mb-2">
                Organize nursing tips, patient care steps, or key insights.
              </p>
              <div
                class="bg-gray-50 dark:bg-slate-800 p-4 rounded font-mono text-xs space-y-2"
              >
                <div class="font-semibold">
                  Unordered list (for tips or insights):
                </div>
                <div class="ml-2">- Always verify patient identity</div>
                <div class="ml-2">- Practice active listening</div>
                <div class="ml-2">
                  - Especially during difficult conversations
                </div>
                <div class="mt-3 font-semibold">
                  Ordered list (for procedures or steps):
                </div>
                <div class="ml-2">1. Assess the patient's condition</div>
                <div class="ml-2">2. Document your findings</div>
                <div class="ml-2">3. Communicate with the care team</div>
              </div>
            </section>

            <!-- Links -->
            <section>
              <h2
                class="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-3"
              >
                Links
              </h2>
              <p class="text-sm text-gray-600 dark:text-slate-400 mb-2">
                Reference nursing research, protocols, or helpful resources.
              </p>
              <div
                class="bg-gray-50 dark:bg-slate-800 p-4 rounded font-mono text-xs space-y-1"
              >
                <div>[ANA Code of Ethics](https://www.nursingworld.org/)</div>
                <div>
                  [Evidence-based practice guidelines](https://example.com
                  "Nursing Research")
                </div>
                <div>&lt;https://www.cdc.gov/nursing&gt; (automatic link)</div>
              </div>
            </section>

            <!-- Images -->
            <section>
              <h2
                class="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-3"
              >
                Images
              </h2>
              <div
                class="bg-gray-50 dark:bg-slate-800 p-4 rounded font-mono text-xs space-y-1"
              >
                <div>![Alt text](image-url.jpg)</div>
                <div>![Alt text](image-url.jpg "Image title")</div>
                <div>![Alt text][image-reference]</div>
                <div class="mt-2 text-xs text-gray-500 dark:text-slate-400">
                  [image-reference]: image-url.jpg "Title"
                </div>
              </div>
            </section>

            <!-- Code -->
            <section>
              <h2
                class="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-3"
              >
                Code & Medical Terms
              </h2>
              <p class="text-sm text-gray-600 dark:text-slate-400 mb-2">
                Format medical terminology, abbreviations, or medication names.
              </p>
              <div
                class="bg-gray-50 dark:bg-slate-800 p-4 rounded font-mono text-xs space-y-2"
              >
                <div>Inline: `BP`, `HR`, `O2 sat`, `PRN`</div>
                <div class="mt-2">For medication lists or protocols:</div>
                <div class="ml-2">```</div>
                <div class="ml-2">Medication: Morphine 2mg IV</div>
                <div class="ml-2">Frequency: Q4H PRN</div>
                <div class="ml-2">Indication: Pain management</div>
                <div class="ml-2">```</div>
              </div>
            </section>

            <!-- Blockquotes -->
            <section>
              <h2
                class="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-3"
              >
                Blockquotes
              </h2>
              <p class="text-sm text-gray-600 dark:text-slate-400 mb-2">
                Highlight inspiring quotes, patient words, or important nursing
                wisdom.
              </p>
              <div
                class="bg-gray-50 dark:bg-slate-800 p-4 rounded font-mono text-xs space-y-1"
              >
                <div>&gt; "Nursing is not just an art, it has a heart."</div>
                <div>&gt;</div>
                <div>
                  &gt; "Thank you for being here with me," the patient said.
                </div>
                <div>&gt; Those words reminded me why I became a nurse.</div>
              </div>
            </section>

            <!-- Horizontal Rule -->
            <section>
              <h2
                class="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-3"
              >
                Horizontal Rule
              </h2>
              <div
                class="bg-gray-50 dark:bg-slate-800 p-4 rounded font-mono text-xs space-y-1"
              >
                <div>---</div>
                <div>or</div>
                <div>***</div>
                <div>or</div>
                <div>___</div>
              </div>
            </section>

            <!-- Line Breaks -->
            <section>
              <h2
                class="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-3"
              >
                Line Breaks
              </h2>
              <div
                class="bg-gray-50 dark:bg-slate-800 p-4 rounded text-xs space-y-1"
              >
                <div>End a line with two spaces for a line break</div>
                <div class="mt-2">
                  Or use a blank line for a paragraph break
                </div>
              </div>
            </section>

            <!-- Tables -->
            <section>
              <h2
                class="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-3"
              >
                Tables
              </h2>
              <p class="text-sm text-gray-600 dark:text-slate-400 mb-2">
                Organize shift schedules, medication lists, or assessment data.
              </p>
              <div
                class="bg-gray-50 dark:bg-slate-800 p-4 rounded font-mono text-xs space-y-1"
              >
                <div>| Medication | Dosage | Frequency |</div>
                <div>|------------|--------|-----------|</div>
                <div>| Morphine | 2mg | Q4H PRN |</div>
                <div>| Aspirin | 81mg | Daily |</div>
              </div>
            </section>

            <!-- Task Lists -->
            <section>
              <h2
                class="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-3"
              >
                Task Lists
              </h2>
              <div
                class="bg-gray-50 dark:bg-slate-800 p-4 rounded font-mono text-xs space-y-1"
              >
                <div>- [ ] Unchecked task</div>
                <div>- [x] Checked task</div>
              </div>
            </section>
          </div>

          <div class="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
            <p class="text-sm text-gray-600 dark:text-slate-400">
              For more detailed information, visit the
              <a
                href="https://www.markdownguide.org/"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-600 dark:text-blue-400 hover:underline"
                >Markdown Guide</a
              >.
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
