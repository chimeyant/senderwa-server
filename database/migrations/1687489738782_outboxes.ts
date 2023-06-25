import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Outboxes extends BaseSchema {
  protected tableName = 'outboxes'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid("uuid")
      table.uuid("user_uuid")
      table.string('sender_number',20)
      table.string('recieve_number',20)
      table.text("content")
      table.string('type').nullable()
      table.string('process').nullable()
      table.integer("max_retry").defaultTo(5)
      table.boolean('sended').defaultTo(false)
      table.string('status').defaultTo('waiting')//

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp("deleted_at",{useTz:true})
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
