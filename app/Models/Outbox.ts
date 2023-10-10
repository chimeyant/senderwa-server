import { DateTime } from 'luxon'
import {v4 as uuid} from "uuid"
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
import {compose} from "@ioc:Adonis/Core/Helpers"
import { BaseModel, BelongsTo, beforeCreate, belongsTo, column, computed } from '@ioc:Adonis/Lucid/Orm'
import Pengaturan from './Pengaturan'

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

  @belongsTo(()=> Pengaturan, {foreignKey: "senderNumber",localKey:"phoneNumber" })
  public pengaturan: BelongsTo<typeof Pengaturan>

  @computed()
  public get datadisplay(){
    return {
      id: this.uuid,
      tanggal: DateTime.fromISO(this.createdAt).toFormat("dd/mm/yyyy H:MM:ss"),
      sender_number: this.senderNumber,
      recieve_number: this.recieveNumber,
      content: this.content,
      status:this.status == 'waiting' ? {color:'grey',text:"Menunggu Antrian"}: this.status == 'waiting' ? {color:'orange',text:"Dalam Proses Pengiriman"}:{color:'green',text:'Terkirim'}
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
