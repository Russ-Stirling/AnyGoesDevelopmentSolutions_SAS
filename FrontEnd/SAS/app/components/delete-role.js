import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  routing: Ember.inject.service('-routing'),

  actions: {

    deleteRole: function(roleID){
      var self = this;
      var myStore = this.get('store');
      if (confirm ('This will delete the role among all users!. Are you sure?')) {

        myStore.find('roleCode',  roleID).then(function(role) {


          role.set('userRoles', []);
          role.set('features', []);
          role.save().then(function(toDelete){
            toDelete.destroyRecord().then(function(){

              myStore.query('userRole', {filter: {role: roleID}}).then(function (userRole) {
                userRole.forEach(function(oneRole){
                  oneRole.user = null;
                  oneRole.role = null;
                  oneRole.save().then(function(toDelete){
                    toDelete.destroyRecord();
                  });
                });
              });

              myStore.query('rolePermission', {filter: {roleCodes: roleID}}).then(function (features) {
                features.forEach(function(oneFeature){

                  var rolePermission = myStore.peekRecord('rolePermission', oneFeature.get('id'));
                  var featureNotAssigned = self.get('sysFeatureModel').every(function (feature) {
                    return (feature.id !== oneFeature);
                  });
                  if (featureNotAssigned) {
                    rolePermission.set('roleCodes', []);
                    rolePermission.save().then();
                  }
                });
              });

            });
          });
        });

      }
    }
  }
});
