/**
 * Generate a URL-friendly slug from a title
 */
export function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Ensure slug is unique by appending a number if needed
 * @param {PrismaClient} prisma - Prisma client instance
 * @param {string} slug - The slug to check
 * @param {string|null} excludeId - ID to exclude from uniqueness check (for updates)
 * @param {string} modelType - 'blog' or 'writing' to check the appropriate model
 */
export async function ensureUniqueSlug(prisma, slug, excludeId = null, modelType = 'blog') {
  if (!slug || typeof slug !== 'string' || !slug.trim()) {
    throw new Error('Slug must be a non-empty string')
  }

  let finalSlug = slug.trim()
  let counter = 1
  const maxAttempts = 100 // Prevent infinite loops

  while (counter <= maxAttempts) {
    try {
      // Check both models to ensure slug is unique across all content
      const [blogPost, writing] = await Promise.all([
        prisma.blogPost.findUnique({
          where: { slug: finalSlug },
          select: { id: true },
        }),
        prisma.writing.findUnique({
          where: { slug: finalSlug },
          select: { id: true },
        }),
      ])

      // If checking blog, exclude if it's the same blog post being updated
      // If checking writing, exclude if it's the same writing being updated
      const isExcluded = excludeId && (
        (modelType === 'blog' && blogPost?.id === excludeId) ||
        (modelType === 'writing' && writing?.id === excludeId)
      )

      if ((!blogPost && !writing) || isExcluded) {
        return finalSlug
      }

      counter++
      finalSlug = `${slug.trim()}-${counter}`
    } catch (error) {
      console.error('[ensureUniqueSlug] Error checking slug uniqueness:', error)
      throw new Error(`Failed to ensure unique slug: ${error.message}`)
    }
  }

  throw new Error(`Unable to generate unique slug after ${maxAttempts} attempts`)
}

