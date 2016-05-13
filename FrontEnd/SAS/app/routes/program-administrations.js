import Ember from 'ember';

export default Ember.Route.extend({
    model(){
        if (this.get('oudaAuth').get('isAuthenticated')) {
            return this.store.findAll('program-administration');
        } 
        else {
            this.transitionTo('login');
        }
    },
    actions: {
        deleteCode: function(id) {
            if(confirm('Are you sure you want to delete this Program Administrator')){
            console.log(id);
            var myStore = this.get('store');
            
            var programAdministrationsData = myStore.peekRecord('programAdministration', id); //Can only peek at records if record has been already loaded to the page
            console.log(programAdministrationsData.get('id'));
            
            programAdministrationsData.deleteRecord(); // Deletes record locally
            programAdministrationsData.save(); // Saves change to the data
            }
        }
    }
});
