import { z } from '@chatapp/common'

export class UserSchema {
  static userIdParams = z.object({
    id: z.string()
  })
  static createUserSchema = z.object({
    email: z.string().refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      error: 'Freaking type the right email man'
    }),
    displayName: z.string().min(2, { error: 'Display name too damn short' })
  })

  static searchUsersQuerySchema = z.object({
    query: z.string().trim().min(3).max(255),
    limit: z
      .union([z.string(), z.number()])
      .transform((value) => Number())
      .refine((value) => Number.isInteger(value) && value > 0 && value <= 25, {
        message: 'Limit must be between 1 and 25'
      })
      .optional(),
    exclude: z.union([
      z.array(z.uuid()),
      z
        .uuid()
        .transform((value) => [value])
        .optional()
        .transform((value) => value ?? [])
    ])
  })
}

export type SearchUsersQuery = z.infer<typeof UserSchema.searchUsersQuerySchema>
export type CreateUserInput = z.infer<typeof UserSchema.createUserSchema>
export type UserIdParams = z.infer<typeof UserSchema.userIdParams>
