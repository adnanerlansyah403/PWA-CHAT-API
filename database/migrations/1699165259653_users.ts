import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('email', 255).notNullable().unique()
      table.string('password', 180).notNullable()
      table.string('remember_me_token').nullable()
      table.integer('role_id').nullable().defaultTo(1)
      table.boolean('status').defaultTo(false)

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamps(true, true)
    })
    
    this.defer(async (db) => {
      const users = await db.from('users').select('*')
      await Promise.all(users.map((user) => {
        return db
          .table('users')
          .insert(user)
      }))
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
