import Ember from 'ember';

export default Ember.Component.extend({
  isEditing: false,
  studentID: null,
  codeName: null,
  edited: false,
  store: Ember.inject.service(),
  routing: Ember.inject.service('-routing'),
  academicProgramCodesModel: [],
  EC001IsPermitted: Ember.computed(function(){ //Edit User
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("EC001") >= 0);
    }
  }),
  actions: {
    selectAcademicCode(code){
        this.set('codeName', code);
    },
    editCode: function() {
        console.log(this.get('studentID'));
        var myStore = this.get('store');
        var frame = this;
        myStore.findAll('academicProgramCode').then(function(d){
            d.forEach(function(s){
                frame.get('academicProgramCodesModel').pushObject(s);
            });
        });
        this.set("isEditing", true);
        
    },
    savePost: function () {
      var editCode;
      var frame = this;
      var myStore= this.get('store');
      myStore.queryRecord('student',{studentID: this.get('studentID')}).then(function(s){
        myStore.queryRecord('distributionResult', {student: s.get('id')}).then(function(d){
            d.set('date', new Date());
            d.save();
            myStore.queryRecord('commentCode', {distributionResult: d.get('id')}).then(function(c){
                c.set('code', "250");
                c.set('progAction', "Special Accepted");
                c.set('description', frame.get('codeName'));
                c.save();
           });
        });
               
    });
      /*
      if(this.get('flag')==="gender"){
        editCode = myStore.peekRecord('gender', this.get('id'));
        editCode.set('name', this.get('name'));
      }
      */
      console.log(JSON.stringify(editCode));
      //newCode.set('body', '"body": "test"' );
        this.set('isEditing', false);
        this.set('edited', true);
      //this.get('routing').transitionTo('');

    },
  
    cancel: function () {
      this.set('isEditing', false);
      
    }
  }
});
