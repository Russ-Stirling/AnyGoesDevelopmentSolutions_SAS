import Ember from 'ember';

export default Ember.Component.extend({
  isUserFormEditing: false,
  store: Ember.inject.service(),
  userRecord: null,
  ID: null,
  Model: null,
  selectedDate: null,
  userName: null,
  encryptedPassword: null,
  isResettingPassword: null,
  EU001IsPermitted: Ember.computed(function(){ //Edit User
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("EU001") >= 0);
    }
  }),
  EU002IsPermitted: Ember.computed(function(){ //ResetPassword
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("EU002") >= 0);
    }
  }),
  EU003IsPermitted: Ember.computed(function(){ //Delete user
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("EU003") >= 0);
    }
  }),

  actions: {
    saveUser () {
      var name = this.get('userName');
      var myStore = this.get('store');
      var self = this;

      myStore.queryRecord('password', {filter: {userName: name}}).then(function (userShadow) {
        userShadow.set('userAccountExpiryDate', new Date(self.get('selectedDate')));
        myStore.find('user',  userShadow.get('user').get('id')).then(function(user) {
          if (self.get('isResettingPassword')){
            var authentication = self.get('oudaAuth');
            userShadow.set('encryptedPassword', authentication.hash(self.get('tempPassword')));
            userShadow.set('passwordMustChanged', true);
            userShadow.set('passwordReset', true);
          }
          userShadow.set ('user', self.get('userRecord'));
          userShadow.save().then(function () {
            user.save().then(function(){
              self.set('isUserFormEditing', false);
            });
          });

        });
      });
    },

    assignDate (date){
      this.set('selectedDate', date);
    },

    resetPassword (){
      this.set('isResettingPassword', true);
    },

    cancelResetPassword () {
      this.set('isResettingPassword', false);
    },

    editUser () {
      var userID = this.get('ID');

      var myStore = this.get('store');
      this.set ('userRecord', this.get('store').peekRecord('user', userID));
      var self = this;
      myStore.queryRecord('password', {filter: {user: userID}}).then(function (userShadow) {
        var date = userShadow.get('userAccountExpiryDate');
        var datestring = date.toISOString().substring(0, 10);
        self.set('selectedDate', datestring);
        self.set('userName', userShadow.get('userName'));
        self.set('isUserFormEditing', true);
      });
    },

    cancel () {
      this.set('isUserFormEditing', false);
    },

    deleteUser(){
      var myStore = this.get('store');
      var userID = this.get('ID');
      if (confirm ('Are you sure you need to delete this user?')) {
        myStore.find('user',  userID).then(function(user) {
          user.set('userRoles', []);
          user.set('userShadow', null);
          user.save().then(function(){
            user.destroyRecord();
          });
        });
        // delete the related password file
        myStore.queryRecord('password', {filter: {user: userID}}).then(function (userShadow) {
          userShadow.set('user', null);
          userShadow.save().then(function(){
            userShadow.destroyRecord();
          });
        });
        // delete the associated user roles
        myStore.query('userRole', {filter: {user: userID}}).then(function (userRoles) {
          userRoles.forEach(function (userRole){
            userRole.user = null;
            userRole.role = null;
            userRole.save().then(function(){
              userRole.destroyRecord();
            });
          });
        });
      }
    }
  }
});
