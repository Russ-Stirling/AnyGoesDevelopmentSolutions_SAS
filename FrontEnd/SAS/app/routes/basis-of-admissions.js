import Ember from 'ember';

export default Ember.Route.extend({
    model(){
        if (this.get('oudaAuth').get('isAuthenticated')) {
            return this.store.findAll('basis-of-admission');
        } 
        else {
            this.transitionTo('login');
        }
    },
    actions: {
        deleteCode: function(id) {
            if(confirm('Are you sure you want to delete this Basis of Admission?')){
            console.log(id);
            var myStore = this.get('store');
            
            var basisOfAdmissionData = myStore.peekRecord('basis-of-admission', id); //Can only peek at records if record has been already loaded to the page
            
            basisOfAdmissionData.deleteRecord(); // Deletes record locally
            basisOfAdmissionData.save(); // Saves change to the data
            }
        }
    }
});
