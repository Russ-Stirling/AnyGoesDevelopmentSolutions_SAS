import Ember from 'ember';

export default Ember.Route.extend({
    model(){
        if (this.get('oudaAuth').get('isAuthenticated')) {
            this.store.findAll('gender');
            this.store.findAll('residency');
            this.store.findAll('country');
            this.store.findAll('province');
            this.store.findAll('city');
            this.store.findAll('academicLoad');
            return this.store.findAll('student');
        } 
        else {
            this.transitionTo('login');
        }
        
    },
    actions: {
        deleteCode: function(id) {
            if(confirm('Are you sure you want to delete this student?')){
            console.log(id);
            var myStore = this.get('store');
            
            var studentsData = myStore.peekRecord('student', id); //Can only peek at records if record has been already loaded to the page
            console.log(studentsData.get('name'));
            
            studentsData.deleteRecord(); // Deletes record locally
            studentsData.save(); // Saves change to the data
            }
        }
    }
});
