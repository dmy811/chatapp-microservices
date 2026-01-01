import fs from 'node:fs'
import path from 'node:path'
import { createConnection, Connection } from 'mysql2/promise'

export class Migrate {
  private connection!: Connection
  constructor(
    private readonly host: string,
    private readonly port: number,
    private readonly user: string,
    private readonly password: string,
    private readonly dbName: string
  ) {}

  private getConnection(): Connection {
    if (!this.connection) {
      throw new Error(
        'database connection not initialized. Call createMysqlConnection first.'
      )
    }
    return this.connection
  }

  async createMysqlConnection(): Promise<void> {
    this.connection = await createConnection({
      host: this.host,
      port: this.port,
      user: this.user,
      password: this.password
    })
  }

  async startMigratingDatabase(): Promise<void> {
    const conn = this.getConnection()
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${this.dbName}\``)
    await conn.query(`USE \`${this.dbName}\``)

    const files = fs
      .readdirSync(path.join(__dirname, 'tables'))
      .filter((file) => file.endsWith('.sql'))
      .sort()

    for (const file of files) {
      await conn.beginTransaction()
      try {
        await conn.query(
          fs.readFileSync(path.join(__dirname, 'tables', file), 'utf8')
        )
        await conn.commit()
      } catch (error) {
        await conn.rollback()
        throw error
      }
    }
  }

  async closeMysqlConnection(): Promise<void> {
    if (this.connection) {
      await this.connection.end()
    }
  }
}
