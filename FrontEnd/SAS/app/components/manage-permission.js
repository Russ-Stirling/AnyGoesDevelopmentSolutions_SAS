//
// This controller is responsible to assign system features
// (i.e., system functionality) to the pre-defined system roles
//
import Ember from 'ember';
export default Ember.Component.extend({
  store: Ember.inject.service(),
  isManagingPermission: false,
  selectedFeature: null,
  code: null, //code is the role code assigned by the caller

  sysFeatureModel: null,

  roleName: Ember.computed(function () {
    var roleCode = this.get('store').peekRecord('roleCode', this.get('code'));
    return roleCode.get('name');
  }),

  rolePermissionModel: Ember.computed(function () {
    return this.get('store').findAll('rolePermission');
  }),

  actions: {
    managePermission() {
      var code = this.get('code');
      var myStore = this.get('store');
      var self = this;
      myStore.query('rolePermission', {filter: {roleCodes: code}}).then(function (codes) {
        self.set('sysFeatureModel', codes);
        self.set('isManagingPermission', true);
      });
    },

    deleteRoleCode: function(id){
      var myStore = this.get('store');
      var self = this;
      if (confirm ('Are you sure?')) {
        var code = this.get('code');
        var roles = [];
        myStore.find('rolePermission', id).then(function(feature) {
          feature.get('roleCodes').forEach(function(rolecode){
            if (rolecode.id !== code) {
              roles.pushObject(rolecode);
            }
          });
          feature.set('roleCodes', roles);
          feature.save().then(function(){
            myStore.query('rolePermission', {filter: {roleCodes: code}}).then(function (codes) {
              self.set('sysFeatureModel', codes);
            });
          });
        });
      }
    },

    done () {
      this.set('isManagingPermission', false);
    },

    selectPermission(permission) {
      var myStore = this.get('store');
      var rolePermission = myStore.peekRecord('rolePermission', permission);
      var featureNotAssigned = this.get('sysFeatureModel').every(function (feature) {
          return (feature.id !== permission);
      });
      var self = this;
      if (featureNotAssigned) {
        var code = this.get('code');
        var roleCode = myStore.peekRecord('roleCode', code);
        rolePermission.get('roleCodes').pushObject(roleCode);
        rolePermission.save().then(function(){
          myStore.query('rolePermission', {filter: {roleCodes: code}}).then(function (codes) {
            self.set('sysFeatureModel', codes);
          });
        });
      }
    }
  }
});
