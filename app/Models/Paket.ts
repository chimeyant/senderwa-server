import { DateTime } from 'luxon'
import {v4 as uuid} from "uuid"
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
import {compose} from "@ioc:Adonis/Core/Helpers"
import { BaseModel, beforeCreate, column, computed } from '@ioc:Adonis/Lucid/Orm'

export default class Paket extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid:string

  @column()
  public name:string

  @column()
  public description: string

  @column()
  public price:number

  @column()
  public deletedAt:DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async createUUID(paket:Paket){
    paket.uuid = uuid()
  }

  @computed()
  public get datadisplay(){
    return{
      id:this.uuid,
      name: this.name,
      description: this.description,
      price: this.price
    }
  }

  @computed()
  public get datarecord(){
    return{
      id:this.uuid,
      name: this.name,
      description: this.description,
      price: this.price
    }
  }
}
