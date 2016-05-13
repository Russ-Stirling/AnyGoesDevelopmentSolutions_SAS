import Ember from 'ember';

export default Ember.Route.extend({
    model(){
        if (this.get('oudaAuth').get('isAuthenticated')) {
            return this.store.findAll('secondary-school');
        } 
        else {
            this.transitionTo('login');
        }
    },
    actions: {
        deleteCode: function(id) {
            if(confirm('Are you sure you want to delete this Secondary School?')){
            console.log(id);
            var myStore = this.get('store');
            var secondarySchoolData = myStore.peekRecord('secondary-school', id); //Can only peek at records if record has been already loaded to the page
            console.log(secondarySchoolData.get('id'));
            
            secondarySchoolData.deleteRecord(); // Deletes record locally
            secondarySchoolData.save(); // Saves change to the data
            }
        }
    }
});
