import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    console.log('do i go here?');
    if (this.get('oudaAuth').get('isAuthenticated')=== false) {
      this.transitionTo('login');
    }
  }
});
