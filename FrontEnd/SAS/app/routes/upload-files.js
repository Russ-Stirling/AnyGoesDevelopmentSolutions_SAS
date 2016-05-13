import Ember from 'ember';

export default Ember.Route.extend({
    model(){
        if (this.get('oudaAuth').get('isAuthenticated')) {
            
        } 
        else {
            this.transitionTo('login');
        }
    },
});
