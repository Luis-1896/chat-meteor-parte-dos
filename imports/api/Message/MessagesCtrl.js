import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {check} from "meteor/check";
import {Message} from "./Message";
import {ResponseMessage} from "../../startup/server/BusinessClass/ResponseMessage";
import Utilities from "./../../startup/server/Utilities";

export const saveMessageMethod=new ValidatedMethod({
    name:'saveMessage',
    validate({mensage}){
        console.log(mensage)
        check(mensage.idSender, String);
        check(mensage.idReceived, String);
        check(mensage.messageSendReceived, String);
    },
    async run({mensage}){
        const responseMessage=new ResponseMessage();
        try{
            let userData = {
                idSender: mensage.idSender,
                idReceived: mensage.idReceived,
                messageSendReceived: mensage.messageSendReceived,
                updated_at: Utilities.currentLocalDate()
            };
            await Message.insert(userData);
            responseMessage.create(true,"Se insertó el mensaje exitosamente");
        }catch (error) {
            console.error("Hubo error al insertar el mensaje",error)
            throw new Meteor.Error("500","Hubo error al insertar el mensaje",error);
        }
        return responseMessage;
    }
});