import { AuthenticatedUser, UnauthorizedError } from '@chatapp/common'

import { Request } from 'express'

export const getAuthenticatedUser = (req: Request): AuthenticatedUser => {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized')
  }

  return req.user
}
