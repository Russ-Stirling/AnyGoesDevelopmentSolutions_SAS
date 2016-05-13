import Ember from 'ember';

export default Ember.Route.extend({
    model(){
        if (this.get('oudaAuth').get('isAuthenticated')) {
            return this.store.findAll('highschool-subject');
        } 
        else {
            this.transitionTo('login');
        }
    },
    actions: {
        deleteCode: function(id) {
            if(confirm('Are you sure you want to delete this Highschool Subject?')){
            console.log(id);
            var myStore = this.get('store');
            var highSchoolSubjectData = myStore.peekRecord('highschool-subject', id); //Can only peek at records if record has been already loaded to the page
            console.log(highSchoolSubjectData.get('id'));
            
            highSchoolSubjectData.deleteRecord(); // Deletes record locally
            highSchoolSubjectData.save(); // Saves change to the data
            }
        }
    }
});
