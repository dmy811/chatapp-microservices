import jwt from 'jsonwebtoken'
import { UnauthorizedError, AuthenticatedUser } from '@chatapp/common'
import { RequestHandler } from 'express'
import { env } from '@/config/env'

interface AccessTokenClaims {
  id: string
}

const parseAuthorizationHeader = (value: string | undefined): string => {
  if (!value) {
    throw new UnauthorizedError('Unauthorized')
  }

  const [scheme, token] = value.split(' ')

  if (scheme.toLowerCase() !== 'bearer' || !token) {
    throw new UnauthorizedError('Unauthorized')
  }

  return token
}

const toAuthenticatedUser = (claims: AccessTokenClaims): AuthenticatedUser => {
  if (!claims.id) {
    throw new UnauthorizedError('Unauthorized')
  }

  return {
    id: claims.id
  }
}

export const requireAuth: RequestHandler = (req, _res, next) => {
  try {
    const basePublicKey = env.JWT_ACCESS_TOKEN_PUBLIC_KEY
    const publicKeyPem = Buffer.from(basePublicKey, 'base64').toString('utf-8')
    const token = parseAuthorizationHeader(req.headers.authorization)
    const claims = jwt.verify(token, publicKeyPem) as AccessTokenClaims
    req.user = toAuthenticatedUser(claims)
    next()
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      next(error)
      return
    }

    next(new UnauthorizedError('Unauthorized'))
  }
}
