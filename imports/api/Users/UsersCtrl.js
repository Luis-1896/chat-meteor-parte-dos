import Meteor from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {check} from 'meteor/check';
import Utilities from "./../../startup/server/Utilities";
import UsersServ from "./UsersServ";
import {ResponseMessage} from '../../startup/server/BusinessClass/ResponseMessage';

//Configuration for user-status
Accounts.onCreateUser((options, user) => {
    const customizedUser = Object.assign({
        status: {
            online: false
        },
    }, user);
    // We still want the default hook's 'profile' behavior.
    if (options.profile) {
        customizedUser.profile = options.profile;
    }
    return customizedUser;
});

export const saveUserMethod=new ValidatedMethod({
    name:'saveUser',
    validate({user}){
        check(user.username,String);
        check(user.name, String);
        check(user.email, String);
        //check(user.password, String);
    },
    async run({user}){
        let responseMessage = new ResponseMessage();
        if(user._id !== ''){
            check(user._id, String);
            await UsersServ.updateUser(user);
            responseMessage.create(true, "Usuario actualizado");
        } else {
            // Usuario nuevo
            try {
                let userData = {
                    username: user.username,
                    email: user.email,
                    password: user.password,
                    profile: {
                        name: user.name,
                        updated_at: Utilities.currentLocalDate()
                    }
                };
                await UsersServ.createUser(userData);
                responseMessage.create(true, 'Usuario creado');
            } catch (e) {
                console.error('Error creating user: ',e);
                throw new Meteor.Error('500', 'Error al crear el usuario', e);
            }
        }
        return responseMessage;
    }
});

export const deleteUserMethod=new ValidatedMethod({
    name:'deleteUser',
    validate({idUser}){
        check(idUser, String);
    },
   async run({idUser}){
        let responseMessage=new ResponseMessage();
        try{
            const userDelete=Meteor.Meteor.users.findOne(idUser);
            console.log(userDelete);
            await UsersServ.deleteUser(userDelete);
            responseMessage.create(true, "Se eliminó el usuario correctamente");
            return responseMessage;
        }catch (e) {
            throw new Meteor.Error('500', 'Error al eliminar el usuario', e);
        }
    }
});