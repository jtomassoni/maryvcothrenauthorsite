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
 */
export async function ensureUniqueSlug(prisma, slug, excludeId = null) {
  if (!slug || typeof slug !== 'string' || !slug.trim()) {
    throw new Error('Slug must be a non-empty string')
  }

  let finalSlug = slug.trim()
  let counter = 1
  const maxAttempts = 100 // Prevent infinite loops

  while (counter <= maxAttempts) {
    try {
      // Check writing slug uniqueness only
      const writing = await prisma.writing.findUnique({
        where: { slug: finalSlug },
        select: { id: true },
      }).catch(err => {
        // If writings table doesn't exist, return null
        if (err.code === 'P2021' || err.message?.includes('does not exist')) {
          console.warn('[ensureUniqueSlug] writings table may not exist:', err.message)
          return null
        }
        throw err
      })

      const isExcluded = excludeId && writing?.id === excludeId

      if (!writing || isExcluded) {
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

