import { z } from 'zod'
import { parseEnv } from 'znv'

export const { JWT_EXPIRES, JWT_SECRET, NODE_ENV, PORT, DATABASE_URL } = parseEnv(process.env, {
  NODE_ENV: z.string(),
  PORT: z.number(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES: z.string(),
  DATABASE_URL: z.string(),
})
