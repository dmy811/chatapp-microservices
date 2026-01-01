import 'dotenv/config'

import { createEnv, z } from '@chatapp/common'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  USER_SERVICE_PORT: z.coerce.number().int().min(0).max(65_536).default(4003),
  USER_DB_NAME: z.string().min(1),
  USER_DB_USER: z.string().min(1),
  USER_DB_PASSWORD: z.string().min(1),
  USER_DB_HOST: z.string().min(1),
  USER_DB_PORT: z.coerce.number().int().min(1).max(65535),
  USER_DB_SSL: z.coerce.boolean().default(false),
  INTERNAL_API_TOKEN: z.string().min(1),
  RABBITMQ_URL: z.string().min(1)
})

type EnvType = z.infer<typeof envSchema>

export const env: EnvType = createEnv(envSchema, {
  serviceName: 'user-service'
})
export type Env = typeof env
