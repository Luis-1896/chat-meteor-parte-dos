import {Meteor} from 'meteor/meteor';
import {ResponseMessage} from "../../startup/server/BusinessClass/ResponseMessage";
import Utilities from "../../startup/server/Utilities";

export default {
    isAvailableNewUsername(oldUsername, newUsername) {
        let targetUsername = [];
        let isAvailable = false;
        if (oldUsername !== newUsername) {
            targetUsername = Meteor.users.find({username: newUsername}).fetch();
            if (targetUsername.length === 0) {
                isAvailable = true;
            }
        }
        return isAvailable;
    },
    isAvailableNewEmail(oldEmail, newEmail) {
        let targetEmail = [];
        let isAvailable = false;
        if (oldEmail !== newEmail) {
            targetEmail = Meteor.users.find({"emails.address": newEmail}).fetch();
            if (targetEmail.length === 0) {
                isAvailable = targetEmail;
            }
        }
        return isAvailable;
    },
    async createUser(userData){
        let responseMessage = new ResponseMessage();
        let idUser=Accounts.createUser(userData);
        if(idUser){
            responseMessage.data={idUser};
        }else{}
        responseMessage.isStatus=true;
        responseMessage.message='User created successful';
        return responseMessage;
    },
    async updateUser(newUser){
        let responseMessage=new ResponseMessage();
        let currentUser=Meteor.users.findOne(newUser._id);
        let isAvailableNewEmail = this.isAvailableNewEmail(currentUser.emails[0].address, newUser.email);
        let isAvailableNewUsername = this.isAvailableNewUsername(currentUser.username, newUser.username);

        if (currentUser.emails[0].address !== newUser.email && !isAvailableNewEmail) {
            throw new Meteor.Error("500", "El nuevo email ya se encuentra en uso");
        }
        if (currentUser.username !== newUser.username && !isAvailableNewUsername) {
            throw new Meteor.Error("500", "El nuevo nombre de usuario ya se encuentra en uso");
        }

        if (currentUser.emails[0].address !== newUser.email) {
            Accounts.removeEmail(newUser._id, currentUser.emails[0].address);
            Accounts.addEmail(newUser._id, newUser.email);
        }

        if(currentUser.username !== newUser.username){
            Accounts.setUsername(newUser._id,newUser.username);
        }

        Meteor.users.update(newUser._id,{
            $set:{
                profile:{
                    name: newUser.name,
                    updated_at: Utilities.currentLocalDate(),
                    path:newUser.photo
                }
            }
        });
        responseMessage.create(true, "Usuario Actualizado");
        return responseMessage;
    },
    deleteUser(user){
        let responseMessage=new ResponseMessage();
        Meteor.users.remove(user._id);
        responseMessage.create(true, "User removed!");
        return responseMessage;
    }
}