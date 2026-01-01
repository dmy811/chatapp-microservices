import { Sequelize } from 'sequelize'
import { env } from '@/config/env'
import { logger } from '@/utils/logger'

const AUTH_DB_URL = `postgresql://${env.USER_DB_USER}:${env.USER_DB_PASSWORD}@${env.USER_DB_HOST}:${env.USER_DB_PORT}/${env.USER_DB_NAME}`
export const sequelize = new Sequelize(AUTH_DB_URL, {
  dialect: 'postgres',
  logging:
    env.NODE_ENV === 'development'
      ? (msg: unknown) => {
          logger.debug({ sequelize: msg })
        }
      : false,
  define: {
    underscored: true, // dengan ini yang properti defaultnya createdAt menjadi created_at
    freezeTableName: true, // utk mencegah sequelize mengubah nama tabel, jadi misal tabel User tidak menjadi Users, melainkan User tetapi User
    timestamps: true
  }
})

export const connectToDatabase = async () => {
  await sequelize.authenticate()
  logger.info('postgresql user database connection established succesfully')
}

export const closeDatabase = async () => {
  await sequelize.close()
  logger.info('postgresql user database connection closed')
}
