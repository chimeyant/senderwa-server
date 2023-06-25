import { DateTime } from 'luxon'
import {v4 as uuid} from "uuid"
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
import {compose} from "@ioc:Adonis/Core/Helpers"
import { BaseModel, beforeCreate, column, computed } from '@ioc:Adonis/Lucid/Orm'

export default class Outbox extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid:string

  @column()
  public userUuid:string

  @column()
  public senderNumber: number

  @column()
  public recieveNumber: number

  @column()
  public content: string

  @column()
  public type:string

  @column()
  public process:string

  @column()
  public maxRetry:number

  @column()
  public sended:boolean

  @column()
  public status:string

  @column()
  public deletedAt:DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async createUUID(outbox:Outbox){
    outbox.uuid = uuid()
  }

  @computed()
  public get datadisplay(){
    return {
      id: this.uuid,
      sender_number: this.senderNumber,
      recieve_number: this.recieveNumber,
      content: this.content,
      status:this.status
    }
  }

  @computed()
  public get datarecord(){
    return {
      id: this.uuid,
      sender_number: this.senderNumber,
      recieve_number: this.recieveNumber,
      content:this.content,
      type: this.type,
      process: this.process,
      status: this.process
    }
  }
}
