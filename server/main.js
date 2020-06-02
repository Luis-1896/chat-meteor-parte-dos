import { Meteor } from 'meteor/meteor';
import '/imports/api/Users/User';
import '/imports/api/Users/UsersCtrl';
import '/imports/api/Users/UsersPubs';
import '/imports/api/Message/Message';
import '/imports/api/Message/MessagesCtrl';
import '/imports/api/Message/MessagesPubs';

Meteor.startup(() => {
  // If the Links collection is empty, add some data.
});