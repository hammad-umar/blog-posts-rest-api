import { z } from 'zod'
import { parseEnv } from 'znv'

export const {
  NODE_ENV,
  PORT,
  DATABASE_URL,
  PUBLIC_KEY,
  PRIVATE_KEY,
  SALT_WORK_FACTOR,
  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} = parseEnv(process.env, {
  NODE_ENV: z.string(),
  PORT: z.number(),
  DATABASE_URL: z.string(),
  PUBLIC_KEY: z.string(),
  PRIVATE_KEY: z.string(),
  SALT_WORK_FACTOR: z.number(),
  ACCESS_TOKEN_TTL: z.string(),
  REFRESH_TOKEN_TTL: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
})
