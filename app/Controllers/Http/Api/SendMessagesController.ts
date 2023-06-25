import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MESSAGE_FORBIDDEN, SOMETHING_WRONG } from 'App/Helpers/Languange'
import PengaturanService from 'App/Services/PengaturanService'
import OutboxService from 'App/Services/Pesan/OutboxService'
import UserService from 'App/Services/UserService'

export default class SendMessagesController {
  async sendMessage({request, response}:HttpContextContract){
    const {apiKey, recieveNumber, message}= request.all()

    const service = new PengaturanService

    const pengaturan  = await service.showByApiKey(apiKey)

    const userSvc = new UserService

    const user =await userSvc.getByUuid(pengaturan?.user_id)

    if(pengaturan){
      const payload = {
        userUuid: user.id,
        userName: user.email,
        senderNumber: pengaturan.phone_number,
        recieveNumber: recieveNumber,
        content: message,
        type: 'text',
        process:'now',
        api:true,
      }

      const outboxsvc = new OutboxService
      const result =  await outboxsvc.storeFromApiService(payload)

      return response.accepted(result)
    }else{
      return response.forbidden({
        code: 403,
        success:false,
        message:MESSAGE_FORBIDDEN
      })
    }
  }
}