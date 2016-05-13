import Ember from 'ember';

export default Ember.Route.extend({
    model(){
        if (this.get('oudaAuth').get('isAuthenticated')) {
            return this.store.findAll('highschool-admission-average');
        } 
        else {
            this.transitionTo('login');
        }
    },
    actions: {
        deleteCode: function(id) {
            if(confirm('Are you sure you want to delete this Highschool Admission Average?')){
            console.log(id);
            var myStore = this.get('store');
            var highSchoolAdmissionAverageData = myStore.peekRecord('highschool-admission-average', id); //Can only peek at records if record has been already loaded to the page
            console.log(highSchoolAdmissionAverageData.get('id'));
            
            highSchoolAdmissionAverageData.deleteRecord(); // Deletes record locally
            highSchoolAdmissionAverageData.save(); // Saves change to the data
            }
        }
    }
});
