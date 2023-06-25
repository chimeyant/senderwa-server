import { DateTime } from 'luxon'
import {v4 as uuid} from "uuid"
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
import {compose} from "@ioc:Adonis/Core/Helpers"
import { BaseModel, beforeCreate, column, computed } from '@ioc:Adonis/Lucid/Orm'

export default class Pengaturan extends compose(BaseModel, SoftDeletes ){
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid:string

  @column()
  public userUuid:string

  @column()
  public name:string

  @column()
  public phoneNumber:string

  @column()
  public queue:number

  @column()
  public apiKey:string

  @column()
  public callbackUrl:string

  @column()
  public status:number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async createUUID(pengaturan:Pengaturan){
    pengaturan.uuid = uuid()
  }

  @beforeCreate()
  public static async createApiKey(pengaturan:Pengaturan){
    pengaturan.apiKey = uuid()
  }

  @computed()
  public get datadisplay(){
    return{
      id:this.uuid,
      name: this.name,
      phone_number: this.phoneNumber,
      status: this.status===1 ? {color:'grey',text:'Pending'}:this.status===2 ? {color:'green',text:'Aktif'}:{color:'red', text:"Tidak Aktif"}
    }
  }

  @computed()
  public get datarecord(){
    return {
      id: this.uuid,
      user_id: this.userUuid,
      name: this.name,
      phone_number: this.phoneNumber,
      queue: this.queue,
      api_key: this.apiKey,
      callback_url: this.callbackUrl,
      status: this.status
    }
  }
}
