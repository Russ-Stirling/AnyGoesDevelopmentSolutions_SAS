import Ember from 'ember';

export default Ember.Route.extend({
    model(){
        if (this.get('oudaAuth').get('isAuthenticated')) {
            return this.store.findAll('faculty');
        } 
        else {
            this.transitionTo('login');
        }
    },
    actions: {
        deleteCode: function(id) {
            if(confirm('Are you sure you want to delete this Faculty?')){
            console.log(id);
            var myStore = this.get('store');
            
            var facultiesData = myStore.peekRecord('faculty', id); //Can only peek at records if record has been already loaded to the page
            console.log(facultiesData.get('id'));
            
            facultiesData.deleteRecord(); // Deletes record locally
            facultiesData.save(); // Saves change to the database
            }
        }
    }
});
