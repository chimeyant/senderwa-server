import { DELETED_SUCCESS, MESSAGE_API_SEND_MSG_SUCCESS, SOMETHING_WRONG, STORE_SUCCESS } from "App/Helpers/Languange";
import Outbox from "App/Models/Outbox";
import SendMessageService from "../SendMessageService";
import Utility from "App/Helpers/Utility";
import { Queue } from "@ioc:Setten/Queue";
import User from "App/Models/User";

export type OutboxInterface = {
  userUuid: string,
  userName:string
  senderNumber:number,
  recieveNumber:number,
  type:string,
  content:string,
  process:string,
  api:boolean,
}

export type OutboxServiceApiType = {
  userUuid: string,
  userName:string,
  senderNumber: number,
  recieveNumber:number,
  type:string,
  content:string,
  process:string,
  api:boolean
}

class OutboxService{
  public async lists(){
    const model = await Outbox.query().orderBy("updated_at",'desc')

    const datas:{}[]=[]

    model.forEach(element => {
      const row ={}
      row['id']= element.uuid
      row['sender_number']= element.senderNumber
      row['recieve_number']= element.recieveNumber
      row['content']= element.content
      row['status']= element.status
      datas.push(row)
    });

    return datas;
  }

  public async store(payload:OutboxInterface){
    try {
      const model = new Outbox
      model.userUuid = payload.userUuid
      model.senderNumber = payload.senderNumber
      model.recieveNumber = payload.recieveNumber
      model.content = payload.content
      model.type = payload.type
      model.process= payload.process

      await model.save()

      const data = {
        uuid: model.uuid,
        userName: payload.userName,
        senderNumber :  payload.senderNumber,
        recieveNumber: await Utility.phoneNumberFormatter(payload.recieveNumber),
        type: payload.type,
        message: payload.content,
        api:payload.api
      }

      //Sendeng Message To Service
      const sendmessage = new SendMessageService(data)
      await sendmessage.open()

      return {
        code:200,
        success:true,
        message: "Pesan sedang dalam proses pengiriman...!",
        data:model.datadisplay
      }
    } catch (error) {
      return {
        code:500,
        success:false,
        message:"Opps..., terjadi kesalahan",
        error:error
      }
    }
  }

  public async show(id:string){
    const model = await Outbox.findBy("uuid",id)

    return model?.datarecord
  }

  public async update(payload:OutboxInterface, id:string){
    try {
      const model = await Outbox.findBy("uuid",id)
      model?.merge({
        senderNumber: payload.sender_number,
        recieveNumber: payload.recieve_number,
        content: payload.content,
        type: payload.type,
        process: payload.process
      })

      await model?.save()

      return{
        code:200,
        success:true,
        message:STORE_SUCCESS,
        data: model?.datadisplay
      }
    } catch (error) {
      return {
        code:500,
        success:false,
        message:SOMETHING_WRONG,
        error:error
      }
    }
  }

  public async delete(id: string){
    try {
      const model = await Outbox.findBy("uuid",id)
      await model?.delete()

      return {
        code:200,
        success:true,
        message:DELETED_SUCCESS,
        data:{id:id}
      }
    } catch (error) {
      return {
        code:500,
        success:false,
        message:SOMETHING_WRONG,
        data:{},
        error:error
      }
    }
  }

  public async storeFromApiService(payload:OutboxServiceApiType){
    try {
      const model = new Outbox
      model.userUuid = payload.userUuid
      model.senderNumber = payload.senderNumber
      model.recieveNumber = payload.recieveNumber
      model.content = payload.content
      model.type = payload.type
      model.process= payload.process

      await model.save()

      //prepare send to job
      const dataOfJob ={
        senderNumber:payload.senderNumber,
        userName: payload.userName,
      }

      const jobId = payload.senderNumber.toString()

      await Queue.dispatch("App/Jobs/SendMessage", dataOfJob, {removeOnComplete:10, removeOnFail:10, repeat:{every:6000}, jobId:jobId })

      return {
        code:200,
        success:true,
        message:MESSAGE_API_SEND_MSG_SUCCESS
      }
    } catch (error) {
      return {
        code:500,
        success:false,
        message: SOMETHING_WRONG,
        error:error
      }
    }
  }

  public async firstBySenderNumber(senderNumber:string){
    const model = await Outbox.query().where('sender_number',senderNumber).where('sended',false).orderBy('created_at','asc').first()
    return model;
  }

  public async  updateStatus(sended:boolean, status:string, id:string){
    try {
      const model = await Outbox.findBy("uuid", id)
      model?.merge({sended: sended, status:status })
      await model?.save()

      return {
        code:200,
        success:true,
        message:"Proses rubah status berhasil",
        data: model?.datadisplay,
      }
    } catch (error) {
      return {
        code:500,
        success:false,
        message:"Opps..., terjadi kesalahan",
        data:{}
      }
    }
  }
}

export default OutboxService
