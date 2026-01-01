import fs from 'node:fs'
import path from 'node:path'
import { logger } from '@/utils/logger'
import { Client } from 'pg'

export class Migrate {
  private client!: Client
  constructor(
    private readonly host: string,
    private readonly port: number,
    private readonly user: string,
    private readonly password: string,
    private readonly dbName: string
  ) {}

  private getClient(): Client {
    if (!this.client) {
      throw new Error(
        'database connection not initialized. Call createPostgresqlConnection first.'
      )
    }
    return this.client
  }

  async createPostgresqlConnection(): Promise<void> {
    this.client = new Client({
      host: this.host,
      port: this.port,
      user: this.user,
      password: this.password,
      database: 'postgres'
    })
  }

  async createDatabaseIfNotExists(): Promise<void> {
    const client = this.getClient()
    const result = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [this.dbName]
    )

    if (result.rowCount === 0) {
      await client.query(`CREATE DATABASE "${this.dbName}"`)
      logger.info(`✅ Database '${this.dbName}' created`)
    } else {
      logger.info(`✅ Database '${this.dbName}' created`)
    }
    await client.end()
  }
  async startMigratingDatabase(): Promise<void> {
    this.client = new Client({
      host: this.host,
      port: this.port,
      user: this.user,
      password: this.password,
      database: this.dbName
    })

    await this.client.connect()
    const client = this.getClient()
    try {
      await client.query('BEGIN')
      await client.query(
        fs.readFileSync(path.join(__dirname, 'tables', 'users.sql'), 'utf8')
      )
      await client.query('COMMIT')
      logger.info('users table successfully created')
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    }
  }

  async closePostgresqlConnection(): Promise<void> {
    if (this.client) {
      await this.client.end()
    }
  }
}
