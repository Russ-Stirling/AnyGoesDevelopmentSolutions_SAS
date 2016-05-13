import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  usersModel: Ember.computed('isUsersShowing', function(){
    return this.get('store').findAll('user');
  })

});
