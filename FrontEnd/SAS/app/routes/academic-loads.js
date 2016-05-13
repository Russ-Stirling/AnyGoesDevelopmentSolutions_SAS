import Ember from 'ember';

export default Ember.Route.extend({
    model(){
        if (this.get('oudaAuth').get('isAuthenticated')) {
            return this.store.findAll('academic-load');
        } 
        else {
            this.transitionTo('login');
        }
    },
    VC001IsPermitted: Ember.computed(function(){ //Edit User
        var authentication = this.get('oudaAuth');
        if (authentication.getName === "Root") {
          return true;
        } else {
          return (authentication.get('userCList').indexOf("VC001") >= 0);
        }
    }),
    EC001IsPermitted: Ember.computed(function(){ //Edit User
        var authentication = this.get('oudaAuth');
        if (authentication.getName === "Root") {
          return true;
        } else {
          return (authentication.get('userCList').indexOf("EC001") >= 0);
        }
    }),
    actions: {
        deleteCode: function(id) {
            if(confirm('Are you sure you want to delete this Academic Load?')){
                console.log(id);
                var myStore = this.get('store');
                
                var academicLoadsData = myStore.peekRecord('academic-load', id); //Can only peek at records if record has been already loaded to the page
                console.log(academicLoadsData.get('id'));
                
                academicLoadsData.deleteRecord(); // Deletes record locally
                academicLoadsData.save(); // Saves change to the data
            }
        }
    }
});
