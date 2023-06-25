import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Pengaturans extends BaseSchema {
  protected tableName = 'pengaturans'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid("uuid")
      table.uuid("user_uuid").notNullable()
      table.string('name').notNullable()
      table.string('phone_number',15).notNullable()
      table.integer("queue").defaultTo(5)
      table.string("api_key").nullable()
      table.string("callback_url").nullable()
      table.enum('status',[1,2,3]).defaultTo(1)

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
