import {Meteor} from 'meteor/meteor';
import {Message} from "./Message";

Meteor.publish('messages', function () {
    const idUserLogged= Meteor.userId();
    return Message.find({
        $or:[{idSender:idUserLogged},
            {idReceived: idUserLogged}]
        },
        {
            limit:20,
            sort:{
                updated_at:-1
            }
        });
});