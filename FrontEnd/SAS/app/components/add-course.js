import Ember from 'ember';

export default Ember.Component.extend({
  isEditing: false,
  store: Ember.inject.service(),
  flag: null,
  routing: Ember.inject.service('-routing'),
  ACC001IsPermitted: Ember.computed(function(){ //Edit User
        var authentication = this.get('oudaAuth');
        if (authentication.getName === "Root") {
          return true;
        } else {
          return (authentication.get('userCList').indexOf("ACC001") >= 0);
        }
  }),
  actions: {
    savePost: function () {
      var newCode;
      var myStore = this.get('store');
      console.log(this.get('name'));
      newCode = myStore.createRecord('course-code', {
          code: this.get('code'),
          number: this.get('number'),
          name: this.get('name'),
          unit: this.get('unit')
          
      });
      
      console.log(JSON.stringify(newCode));
      //newCode.set('body', '"body": "test"' );
      newCode.save();
      
      this.set('unit', "");
      this.set('number', "");
      this.set('name', "");
      this.set('code', "");
      this.set('isEditing', false);
      //this.get('routing').transitionTo('');

    },

    addNewCode: function () {
      this.set('isEditing', true);
    },

    cancel: function () {
      this.set('isEditing', false);
    }
  }
});

