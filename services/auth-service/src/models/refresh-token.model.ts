import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '@/db/sequelize'
import { UserCredentials } from './user-credentials.model'

export interface RefreshTokenAttributes {
  id: string
  userId: string
  tokenHash: string
  expiresAt: string
  revokedAt: Date
  userAgent: string
  ipAddress: string
  createdAt: Date
  updatedAt: Date
}

export type RefreshTokenCreationAttributes = Optional<
  RefreshTokenAttributes,
  'id' | 'createdAt' | 'updatedAt'
>

// rule Model generic sequelize =
// extends Model<TModelAttributes = any, TCreationAttributes = TModelAttributes>
// TModelAttrbutes artinya bentuk data setelah ada di DB
// TCreationAttributes artinya bentuk data saat create
export class RefreshToken
  extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes>
  implements RefreshTokenAttributes
{
  declare id: string
  declare userId: string
  declare tokenHash: string
  declare expiresAt: string
  declare revokedAt: Date
  declare userAgent: string
  declare ipAddress: string
  declare createdAt: Date
  declare updatedAt: Date
}

RefreshToken.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    tokenHash: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    revokedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  { sequelize, tableName: 'refresh_tokens' }
)

UserCredentials.hasMany(RefreshToken, {
  foreignKey: 'userId',
  as: 'refreshTokens',
  onDelete: 'CASCADE'
})

RefreshToken.belongsTo(UserCredentials, {
  foreignKey: 'userId',
  as: 'user'
})
