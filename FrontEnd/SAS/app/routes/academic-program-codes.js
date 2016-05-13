import Ember from 'ember';

export default Ember.Route.extend({
    model(){
        if (this.get('oudaAuth').get('isAuthenticated')) {
            return this.store.findAll('academic-program-code');
        } 
        else {
            this.transitionTo('login');
        }
    },
    actions: {
        deleteCode: function(id) {
            if(confirm('Are you sure you want to delete this Academic Program Code?')){
            console.log(id);
            var myStore = this.get('store');
            
            var academicProgramCodesData = myStore.peekRecord('academic-program-code', id); //Can only peek at records if record has been already loaded to the page
            console.log(academicProgramCodesData.get('id'));
            
            academicProgramCodesData.deleteRecord(); // Deletes record locally
            academicProgramCodesData.save(); // Saves change to the data
            }
        }
    }
});
