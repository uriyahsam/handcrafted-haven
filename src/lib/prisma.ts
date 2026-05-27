// Prisma 7: PrismaClient requires a driver adapter (not a URL in schema.prisma)
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaPg } = require('@prisma/adapter-pg')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalForPrisma = globalThis as unknown as { prisma: any }

function createPrismaClient() {
  // PrismaPg accepts a connection string, Pool instance, or PoolConfig
  const adapter = new PrismaPg(process.env.DATABASE_URL as string)
  return new PrismaClient({ adapter })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const prisma: any = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
