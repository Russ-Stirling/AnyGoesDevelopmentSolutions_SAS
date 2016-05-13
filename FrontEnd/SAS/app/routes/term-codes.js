import Ember from 'ember';

export default Ember.Route.extend({
    model(){
        if (this.get('oudaAuth').get('isAuthenticated')) {
            return this.store.findAll('term-code');
        } 
        else {
            this.transitionTo('login');
        }
    },
    actions: {
        deleteCode: function(id) {
            if(confirm('Are you sure you want to delete this Term Code?')){
            console.log(id);
            var myStore = this.get('store');
            
            var termCodesData = myStore.peekRecord('term-code', id); //Can only peek at records if record has been already loaded to the page
            console.log(termCodesData.get('id'));
            
            termCodesData.deleteRecord(); // Deletes record locally
            termCodesData.save(); // Saves change to the data
            }
        }
    }
});
