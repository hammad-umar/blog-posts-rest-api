import { parseEnv } from 'znv'
import { z } from 'zod'
import log from './helpers/logger'

export const { JWT_EXPIRES, JWT_SECRET, NODE_ENV, PORT } = parseEnv(process.env, {
  NODE_ENV: z.string(),
  PORT: z.number(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES: z.string(),
})

log.info([JWT_EXPIRES, JWT_SECRET, NODE_ENV, PORT].join(','))
