import { DELETED_SUCCESS, SOMETHING_WRONG, STORE_SUCCESS } from "App/Helpers/Languange";
import Contact from "App/Models/Contact";

interface ContactInterface {
  name:string,
  phone:number,
  status:boolean
}

class ContactService {

  constructor() {
  }

  public async list(userId:string){
    const model = await Contact.query().where('user_uuid', userId).orderBy("name",'asc')

    const datas:{}[]= []

    model.forEach(element => {
      const row = {}
      row['id']= element.uuid
      row['name'] = element.name
      row['phone'] = element.phone
      row['status']= element.status ? {color:'green',text:'Aktif'}:{color:'red',text:"Tidak Aktif"}
      datas.push(row)
    });

    return datas;
  }

  public async store(payload:ContactInterface, userId:string){
    try {
      const model = new Contact
      model.userUuid = userId
      model.name = payload.name,
      model.phone = payload.phone
      model.status = payload.status
      await model.save()

      return {
        code:200,
        success:true,
        message:STORE_SUCCESS,
        data: model.datadisplay
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

  public async show(id:string){
    const model = await Contact.findBy("uuid",id)

    return model?.datarecord
  }

  public async update(payload:ContactInterface, id:string){
    try {
      const model = await Contact.findBy("uuid",id)
      model?.merge({
        name:payload.name,
        phone:payload.phone,
        status:payload.status
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
        success: false,
        message:SOMETHING_WRONG,
        error:error
      }
    }
  }

  public async delete(id:string){
    try {
      const model = await Contact.findBy("uuid",id)
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
        error:error
      }
    }
  }

  public async combo(){
    const model = await Contact.query().orderBy("name",'asc')

    const datas:{}[]=[]

    model.forEach(element => {
      const row ={}
      row['value']= element.phone
      row['text']= element.name + " | "+ element.phone
      datas.push(row)
    });

    return datas;
  }
}

export default ContactService
