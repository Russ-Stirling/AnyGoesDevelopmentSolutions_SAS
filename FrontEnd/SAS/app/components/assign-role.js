//
// This controller is responsible to assign system roles
// to existing users
//
import Ember from 'ember';
export default Ember.Component.extend({
  store: Ember.inject.service(),
  isManagingUserRole: false,
  ID: null,
  selectedRole: null,
  userRoleModel: null,
  MR001IsPermitted: Ember.computed(function(){
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("MR001") >= 0);
    }
  }),

  userName: Ember.computed(function () {
    var User = this.get('store').peekRecord('user', this.get('ID'));
    return User.get('firstName');
  }),

  roleCodeModel: Ember.computed(function () {
    return this.get('store').findAll('roleCode');
  }),

  actions: {
    manageRoles(userID) {
      var myStore = this.get('store');
      var self = this;
      self.set('userRoleModel',  []);
      myStore.query('userRole', {filter: {user: userID}}).then(function (roles) {
        roles.forEach(function (oneRole) {
          var roleID = oneRole.get('role').get('id');
          self.get('store').findRecord('roleCode', roleID).then(function(role){
            self.get('userRoleModel').pushObject(role);
          });
        });
       self.set('isManagingUserRole', true);
      });
    },


    done () {
      this.set('isManagingUserRole', false);
    },

    selectRole(role) {
      var myStore = this.get('store');
      var roleCode = myStore.peekRecord('roleCode', role);
      var roleNotAssigned = this.get('userRoleModel').every(function (oneRole) {
        return (role !== oneRole.id);
      });
      if (roleNotAssigned) {
        this.get('userRoleModel').pushObject(roleCode);
        var userID = this.get('ID');
        var User = myStore.peekRecord('user', userID);
        var now = new Date();
        var newUserRole = myStore.createRecord('userRole', {
          dateAssigned: now,
          user: User,
          role: roleCode
        });
        newUserRole.save();
      }
    },

    deleteRole: function(id, userID){
      var myStore = this.get('store');
      if (confirm ('Are you sure?')) {


        var roles = [];

        this.get('userRoleModel').forEach(function(userrole) {
          if (userrole.id !== id) {
            roles.pushObject(userrole);
          }
        });
        this.set('userRoleModel', roles);

        myStore.queryRecord('userRole', {filter: {user: userID, role: id}}).then(function (userRole) {
          userRole.user = null;
          userRole.role = null;
          userRole.save().then(function(toDelete){
            toDelete.destroyRecord();
          });
        });
      }
    }
  }
});
