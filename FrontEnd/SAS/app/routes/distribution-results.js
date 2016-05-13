import Ember from 'ember';

export default Ember.Route.extend({
    model(){
        if (this.get('oudaAuth').get('isAuthenticated')) {
            this.get('store').findAll('academicProgramCode');
            this.get('store').findAll('logicalExpression');
            return this.get('store').findAll('admissionRule');
        }
        else {
            this.transitionTo('login');
        }
    },
});
