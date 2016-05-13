import Ember from 'ember';

export default Ember.Route.extend({
    model(){
        if (this.get('oudaAuth').get('isAuthenticated')) {
            return this.store.findAll('department');
        } 
        else {
            this.transitionTo('login');
        }
    },
    actions: {
        deleteCode: function(id) {
            if(confirm('Are you sure you want to delete this Department?')){
            console.log(id);
            var myStore = this.get('store');
            var departmentsData = myStore.peekRecord('department', id); //Can only peek at records if record has been already loaded to the page
            console.log(departmentsData.get('id'));
            
            departmentsData.deleteRecord(); // Deletes record locally
            departmentsData.save(); // Saves change to the data
            }
        }
    }
});
