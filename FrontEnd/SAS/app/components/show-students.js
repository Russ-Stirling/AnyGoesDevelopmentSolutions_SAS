import Ember from 'ember';

export default Ember.Component.extend({
  isEditing: false,
  displayAll: false,
  showResults: false,
  searchedWord: null,
  store: Ember.inject.service(),
  routing: Ember.inject.service('-routing'),
  allStudents: [],
  sorting:['lastName:asc', 'firstName:asc'],
  VS001IsPermitted: Ember.computed(function(){ //Edit User
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("VS001") >= 0);
    }
  }),
  /*
  studentsModel: Ember.computed('isEditing', function(){
    return this.get('store').findAll('student');
  }),
  */
  sortedStudents: Ember.computed.sort('test', 'sorting'),
  searchedStudents:[], //: Ember.computed.filterBy('studentsModel','studentID','searchedWord'),
  
  actions: {
    showStudent: function () {
      this.set('isEditing', false);
      this.set('isEditing', true);
      this.set('displayAll', true);
    },
    search: function() {
      this.set('searchedWord', this.get('searchCriteria'));
      console.log(this.get('searchedWord'));
      this.get('searchedStudents').pushObject(this.get('store').queryRecord('student', {studentID : this.get('searchedWord')}));
      this.set('displayAll', false);
      this.set('showResults', true);
    },
    singleStudent: function(id) {
      this.get('routing').transitionTo('student', [id]);
    },
    deleteCode: function(id, i){
      console.log(id);
      var myStore = this.get('store');
      var studentData = myStore.peekRecord('student', id); //Can only peek at records if record has been already loaded to the page
      console.log(studentData.get('id'));
      studentData.get('itrPrograms').forEach(function(itrID){
        var itrRecord = myStore.peekRecord('itr-program', itrID);
      });
          
      studentData.deleteRecord(); // Deletes record locally
      studentData.save(); // Saves changes to database
      this.get('allStudents').removeAt(i);
    },

  }
});