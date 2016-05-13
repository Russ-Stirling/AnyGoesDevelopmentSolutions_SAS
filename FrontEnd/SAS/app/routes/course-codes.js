import Ember from 'ember';

export default Ember.Route.extend({
    model(){
        if (this.get('oudaAuth').get('isAuthenticated')) {
            return this.store.findAll('course-code');
        } 
        else {
            this.transitionTo('login');
        }
    },

    actions: {
        deleteCode: function(id) {
            if(confirm('Are you sure you want to delete this Course Code?')){
            console.log(id);
            var myStore = this.get('store');
            
            var courseCodesData = myStore.peekRecord('course-code', id); //Can only peek at records if record has been already loaded to the page
            console.log(courseCodesData.get('id'));
            
            courseCodesData.deleteRecord(); // Deletes record locally
            courseCodesData.save(); // Saves change to the data
            }
        }
    }
});
