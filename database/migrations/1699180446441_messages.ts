import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'messages'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.bigInteger('conversation_id').unsigned().references('id').inTable('conversations').onDelete('cascade')
      table.bigInteger('sender_id').unsigned().references('id').inTable('users').onDelete('cascade')
      table.bigInteger('receiver_id').unsigned().references('id').inTable('users').onDelete('cascade')

      table.boolean('is_readed').defaultTo(false)
      table.text('content')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
