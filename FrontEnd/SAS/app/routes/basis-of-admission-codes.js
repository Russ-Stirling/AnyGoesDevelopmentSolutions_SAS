import Ember from 'ember';

export default Ember.Route.extend({
    model(){
        if (this.get('oudaAuth').get('isAuthenticated')) {
            return this.store.findAll('basis-of-admission-code');
        } 
        else {
            this.transitionTo('login');
        }
    },
    actions: {
        
    }
});
