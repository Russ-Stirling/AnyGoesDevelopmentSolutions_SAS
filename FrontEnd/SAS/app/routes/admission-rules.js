import Ember from 'ember';

export default Ember.Route.extend({
    model(){
        if (this.get('oudaAuth').get('isAuthenticated')) {
            this.store.findAll('academicProgramCode');
            return this.store.findAll('admission-rule');
        } 
        else {
            this.transitionTo('login');
        }
    },
    actions: {
        deleteCode: function(id) {
            if(confirm('Are you sure you want to delete this gender')){
            console.log(id);
            var myStore = this.get('store');
            
            var admissionRulesData = myStore.peekRecord('admission-rule', id); //Can only peek at records if record has been already loaded to the page
            console.log(admissionRulesData.get('id'));
            
            admissionRulesData.deleteRecord(); // Deletes record locally
            admissionRulesData.save(); // Saves change to the data
            }
        }
    }
});
