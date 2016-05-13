import Ember from 'ember';

export default Ember.Route.extend({
    model(){
        if (this.get('oudaAuth').get('isAuthenticated')) {
            return this.store.findAll('gender');
        } 
        else {
            this.transitionTo('login');
        }
    },
    
    actions: {
        /*
        deleteCode: function(id) {
            if(confirm('Are you sure you want to delete this gender?')){
                console.log(id);
                var myStore = this.get('store');
                
                var genderData = myStore.peekRecord('gender', id); //Can only peek at records if record has been already loaded to the page
                console.log(genderData.get('name'));
                
                genderData.deleteRecord(); // Deletes record locally
                genderData.save(); // Saves changes to database
            }
        }
        */
    }
    
});