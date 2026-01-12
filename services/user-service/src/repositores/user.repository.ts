import { AuthUserRegisteredPayload } from '@chatapp/common'

import { Users } from '@/models'
import { UserAttributes } from '@/models/user.model'
import { CreateUserInput } from '@/types/user'
import { Op, WhereOptions } from 'sequelize'

export interface DomainUser extends UserAttributes {
  createdAt: Date
  updatedAt: Date
}

const toDomainUser = (model: Users): DomainUser => ({
  id: model.id,
  email: model.email,
  displayName: model.displayName,
  createdAt: model.createdAt,
  updatedAt: model.updatedAt
})

export class UserRepository {
  constructor(private readonly userModel: typeof Users) {}

  public async findById(id: string): Promise<DomainUser | null> {
    const user = await this.userModel.findByPk(id)
    return user ? toDomainUser(user) : null
  }

  public async findAll(): Promise<DomainUser[]> {
    const users = await this.userModel.findAll({
      order: [['displayName', 'ASC']]
    })

    return users.map(toDomainUser)
  }

  async create(data: CreateUserInput): Promise<DomainUser> {
    const user = await this.userModel.create(data)
    return toDomainUser(user)
  }

  async searchByQuery(
    query: string,
    options: { limit?: number; excludeIds?: string[] } = {}
  ): Promise<DomainUser[]> {
    const where: WhereOptions = {
      [Op.or]: [
        { displayName: { [Op.iLike]: `%${query}%` } },
        { email: { [Op.iLike]: `%${query}%` } }
      ]
    }

    if (options.excludeIds && options.excludeIds.length > 0) {
      Object.assign(where, {
        [Op.and]: [{ id: { [Op.notIn]: options.excludeIds } }]
      })
    }

    const users = await this.userModel.findAll({
      where,
      order: [['displayName', 'ASC']],
      limit: options.limit ?? 10
    })

    return users.map(toDomainUser)
  }

  public async upsertFromAuthEvent(
    payload: AuthUserRegisteredPayload
  ): Promise<DomainUser> {
    const [user] = await this.userModel.upsert(
      {
        id: payload.id,
        email: payload.email,
        displayName: payload.displayName
      },
      { returning: true }
    )
    return toDomainUser(user)
  }
}
