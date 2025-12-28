// Vercel serverless function to check if database tables exist
// This is a diagnostic endpoint to help troubleshoot migration issues
import { PrismaClient } from '@prisma/client'

export default async function handler(req, res) {
  const prisma = new PrismaClient()

  try {
    // Try to query writings table
    const [writingsExist] = await Promise.allSettled([
      prisma.writing.findFirst(),
    ])

    const writingsTableExists =
      writingsExist.status === 'fulfilled' ||
      (writingsExist.status === 'rejected' &&
        writingsExist.reason?.code !== 'P2021' &&
        !writingsExist.reason?.message?.includes('does not exist'))

    // Check for P2021 errors specifically
    const writingsError =
      writingsExist.status === 'rejected' &&
      (writingsExist.reason?.code === 'P2021' ||
        writingsExist.reason?.message?.includes('does not exist'))

    return res.status(200).json({
      ok: true,
      tables: {
        writings: {
          exists: !writingsError,
          error: writingsError ? writingsExist.reason?.message : null,
        },
      },
      allTablesExist: !writingsError,
    })
  } catch (error) {
    console.error('[check-tables] Error:', error)
    return res.status(500).json({
      ok: false,
      error: error.message,
    })
  } finally {
    await prisma.$disconnect()
  }
}
