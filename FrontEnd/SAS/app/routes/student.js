import Ember from 'ember';

export default Ember.Route.extend({
    model(params){
        if (this.get('oudaAuth').get('isAuthenticated')) {
            return this.get('store').findRecord('student', params.student_id);
        }
        else {
           this.transitionTo('login');
        }
    }
});
