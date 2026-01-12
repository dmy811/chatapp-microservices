import { publishUserCreated } from '@/messaging/producers/auth-events.pubsliher'
import { DomainUser, UserRepository } from '@/repositores/user.repository'
import { CreateUserInput } from '@/types/user'
import {
  AuthUserRegisteredPayload,
  ConflictError,
  NotFoundError,
  UserCreatedPayload
} from '@chatapp/common'
import { UniqueConstraintError } from 'sequelize'

export class UserService {
  constructor(private readonly repository: UserRepository) {}

  public async getUserById(id: string): Promise<DomainUser> {
    const user = await this.repository.findById(id)
    if (!user) {
      throw new NotFoundError('User not found')
    }
    return user
  }

  public async getAllUsers(): Promise<DomainUser[]> {
    return this.repository.findAll()
  }

  async searchUsers(params: {
    query: string
    limit?: number
    excludeIds?: string[]
  }): Promise<DomainUser[]> {
    const query = params.query.trim()
    if (query.length === 0) {
      return []
    }

    return this.repository.searchByQuery(query, {
      limit: params.limit,
      excludeIds: params.excludeIds
    })
  }

  public async createUser(input: CreateUserInput): Promise<DomainUser> {
    try {
      const user = await this.repository.create(input)

      const userData = {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      }

      // publish user createed event
      publishUserCreated(userData as UserCreatedPayload)

      return user
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new ConflictError('User already exists')
      }
      throw error
    }
  }

  public async upsertUserFromAuthEvent(
    payload: AuthUserRegisteredPayload
  ): Promise<DomainUser> {
    const user = await this.repository.upsertFromAuthEvent(payload)
    const userData = {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    }

    // publish user createed event
    publishUserCreated(userData as UserCreatedPayload)
    return user
  }
}
