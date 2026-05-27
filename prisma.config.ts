import { defineConfig } from 'prisma/config'
import { loadEnvConfig } from '@next/env'

loadEnvConfig(process.cwd())

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    seed: 'ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts',
  },
  datasource: {
    get url() {
      const url = process.env.DATABASE_URL
      if (!url) throw new Error('DATABASE_URL is not set in .env.local')
      return url
    },
  },
})