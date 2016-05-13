import Ember from 'ember';

export default Ember.Route.extend({
    model(){
        if (this.get('oudaAuth').get('isAuthenticated')) {
            return this.store.findAll('degree-code');
        } 
        else {
            this.transitionTo('login');
        }
    },
    actions: {
        deleteCode: function(id) {
            if(confirm('Are you sure you want to delete this Degree Code?')){
            console.log(id);
            var myStore = this.get('store');
            
            var degreeCodesData = myStore.peekRecord('degree-code', id); //Can only peek at records if record has been already loaded to the page
            console.log(degreeCodesData.get('id'));
            
            degreeCodesData.deleteRecord(); // Deletes record locally
            degreeCodesData.save(); // Saves change to the data
            }
        }
    }
});
