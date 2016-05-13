import Ember from 'ember';

export default Ember.Route.extend({
    model(){
        if (this.get('oudaAuth').get('isAuthenticated')) {
            return this.store.findAll('highscool-courses-mark');
        } 
        else {
            this.transitionTo('login');
        }
    },
    actions: {
        deleteCode: function(id) {
            if(confirm('Are you sure you want to delete this Highschool Courses Mark?')){
            console.log(id);
            var myStore = this.get('store');
            var highSchoolCoursesMarkData = myStore.peekRecord('highschool-courses-mark', id); //Can only peek at records if record has been already loaded to the page
            console.log(highSchoolCoursesMarkData.get('id'));
            
            highSchoolCoursesMarkData.deleteRecord(); // Deletes record locally
            highSchoolCoursesMarkData.save(); // Saves change to the data
            }
        }
    }
});
