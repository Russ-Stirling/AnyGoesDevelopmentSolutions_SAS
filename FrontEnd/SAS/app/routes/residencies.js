import Ember from 'ember';

export default Ember.Route.extend({
    model(){
        if (this.get('oudaAuth').get('isAuthenticated')) {
            return this.store.findAll('residency');
        } 
        else {
            this.transitionTo('login');
        }
    },
    actions: {
        deleteCode: function(id) {
            if(confirm('Are you sure you want to delete this Residency?')){
            console.log(id);
            var myStore = this.get('store');
            
            var residenciesData = myStore.peekRecord('residency', id); //Can only peek at records if record has been already loaded to the page
            
            residenciesData.deleteRecord(); // Deletes record locally
            residenciesData.save(); // Saves change to the data
            }
        }
    }
});