import { Migrate } from '@/migrations/migrate'
import { env } from '@/config/env'
import { logger } from '@/utils/logger'

const migrate = new Migrate(
  env.USER_DB_HOST,
  env.USER_DB_PORT,
  env.USER_DB_USER,
  env.USER_DB_PASSWORD,
  env.USER_DB_NAME
)

async function executeMigration() {
  try {
    await migrate.createPostgresqlConnection()
    await migrate.createDatabaseIfNotExists()
    await migrate.startMigratingDatabase()

    logger.info('🚀 Database migration completed successfully')
  } catch (error) {
    logger.error('❌ Database migration failed')
  } finally {
    await migrate.closePostgresqlConnection()
  }
}

executeMigration()
