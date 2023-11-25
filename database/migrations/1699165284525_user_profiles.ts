import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'user_profiles'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.bigInteger('user_id').unsigned().references('id').inTable('users').onDelete('cascade')

      table.string('name')
      table.string('phone_number').nullable()
      table.string('place_of_birth').nullable()
      table.date('birth_date').nullable()
      table.string('address')
      table.enum('gender', ['male', 'female'])

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamps(true, true)
    })
    
    this.defer(async (db) => {
      const user_profiles = await db.from('user_profiles').select('*')
      await Promise.all(user_profiles.map((up) => {
        return db
          .table('user_profiles')
          .insert(up)
      }))
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
