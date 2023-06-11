import { z } from 'zod'
import { parseEnv } from 'znv'

export const {
  JWT_EXPIRES,
  JWT_SECRET,
  NODE_ENV,
  PORT,
  DATABASE_URL,
  PUBLIC_KEY,
  PRIVATE_KEY,
  SALT_WORK_FACTOR,
  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL,
} = parseEnv(process.env, {
  NODE_ENV: z.string(),
  PORT: z.number(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES: z.string(),
  DATABASE_URL: z.string(),
  PUBLIC_KEY: z.string(),
  PRIVATE_KEY: z.string(),
  SALT_WORK_FACTOR: z.number(),
  ACCESS_TOKEN_TTL: z.string(),
  REFRESH_TOKEN_TTL: z.string(),
})
