import Ember from 'ember';

export default Ember.Component.extend({
  isEditing: false,
  store: Ember.inject.service(),
  rolePermissionModel: Ember.computed('isFeaturesEditing', function () {
    return this.get('store').findAll('rolePermission');
  }),

  MF001IsPermitted: Ember.computed(function(){ //Manage Features
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("MF001") >= 0);
    }
  }),
  actions: {
    addNewFeature(){
      this.set('isEditing', true);
    },

    save(){
      var myStore = this.get('store');
      var newRolePermission = myStore.createRecord('rolePermission', {
        code: this.get('code'),
        sysFeature: this.get('sysFeature')
      });
      newRolePermission.save();
      this.set('isEditing', false);
    },

    cancel() {
      this.set('isEditing', false);
    }
  }
});
