import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '@/db/sequelize'

export interface UserAttributes {
  id: string
  email: string
  displayName: string
}

export type UserCreationAttributes = Optional<UserAttributes, 'id'>

// rule Model generic sequelize =
// extends Model<TModelAttributes = any, TCreationAttributes = TModelAttributes>
// TModelAttrbutes artinya bentuk data setelah ada di DB
// TCreationAttributes artinya bentuk data saat create
export class Users
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: string
  declare email: string
  declare displayName: string

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Users.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'users',
    indexes: [
      {
        unique: true,
        name: 'users_unique_email',
        fields: ['email']
      }
    ]
  }
)
