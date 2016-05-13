import Ember from 'ember';

export default Ember.Route.extend({
    model(){
        if (this.get('oudaAuth').get('isAuthenticated')) {
            return this.store.findAll('scholar-and-award-code');
        } 
        else {
            this.transitionTo('login');
        }
    },
    actions: {
        deleteCode: function(id) {
            if(confirm('Are you sure you want to delete this Scholar and Award Code')){
            console.log(id);
            var myStore = this.get('store');
            var scholarAndAwardCodeData = myStore.peekRecord('scholar-and-award-code', id); //Can only peek at records if record has been already loaded to the page
            console.log(scholarAndAwardCodeData.get('id'));
            
            scholarAndAwardCodeData.deleteRecord(); // Deletes record locally
            scholarAndAwardCodeData.save(); // Saves change to the data
            }
        }
    }
});
