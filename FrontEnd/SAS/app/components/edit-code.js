import Ember from 'ember';

export default Ember.Component.extend({
  isEditing: false,
  departmentDrop: false,
  courseCodeEdit: false,
  facultyDrop: false,
  store: Ember.inject.service(),
  flag: null,
  id: null,
  faculty: null,
  department: null,
  routing: Ember.inject.service('-routing'),
  EC001IsPermitted: Ember.computed(function(){ //Edit User
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("EC001") >= 0);
    }
  }),
  facultiesModel: Ember.computed('isEditing', function(){
    // Ember.Logger.log("Hello");
    return this.get('store').findAll('faculty');
  }),
  departmentsModel: Ember.computed('isEditing', function(){
    // Ember.Logger.log("Hello");
    return this.get('store').findAll('department');
  }),
  
  actions: {
    selectFaculty(faculty){
      this.set('faculty', faculty);
    },
    selectDepartment(department){
      this.set('department', department);
    },
    editCode: function() {
        console.log("trying to edit");
        console.log(this.get("id"));
        console.log(this.get("flag"));
        this.set("isEditing", true);
        this.set('name', this.get('name'));
        if(this.get('flag')=="program-administration"){
        this.set('departmentDrop', true);
        }
        else if(this.get('flag')=="department"){
          this.set('facultyDrop', true);
        }
        else if(this.get('flag')=="courseCode"){
          this.set('courseCodeEdit', true);
        }
    },
    savePost: function () {
      var editCode;
      var myStore;
      myStore= this.get('store');
      if(this.get('flag')==="gender"){
        editCode = myStore.peekRecord('gender', this.get('id'));
        editCode.set('name', this.get('name'));
      }
      else if(this.get('flag')==="residency"){
        editCode = myStore.peekRecord('residency', this.get('id'));
        editCode.set('name', this.get('name'));
      }
      else if(this.get('flag')==="academic-load"){
        editCode = myStore.peekRecord('academic-load', this.get('id'));
        editCode.set('name', this.get('name'));
      }
      else if(this.get('flag')==="itr-program"){
        //Do nothing itr's are created when the student is created.
      }
      else if(this.get('flag')==="academic-program-code"){
        editCode = myStore.peekRecord('academic-program-code', this.get('id'));
        editCode.set('name', this.get('name'));
      }
      else if(this.get('flag')==="faculty"){
        editCode = myStore.peekRecord('faculty', this.get('id'));
        editCode.set('name', this.get('name'));
      }
      else if(this.get('flag')==="term-code"){
        editCode = myStore.peekRecord('term-code', this.get('id'));
        editCode.set('name', this.get('name'));
      }
      else if(this.get('flag')==="degree-code"){
        editCode = myStore.peekRecord('degree-code', this.get('id'));
        editCode.set('name', this.get('name'));
      }
      else if(this.get('flag')==="city"){
        editCode = myStore.peekRecord('city', this.get('id'));
        editCode.set('name', this.get('name'));
      }
      else if(this.get('flag')==="province"){
        editCode = myStore.peekRecord('province', this.get('id'));
        editCode.set('name', this.get('name'));
      }
      else if(this.get('flag')==="country"){
        console.log(this.get('id'));
        console.log(this.get('name'));
        editCode = myStore.peekRecord('country', this.get('id'));
        editCode.set('name', this.get('name'));
      }
      else if(this.get('flag')=="department"){
        console.log(this.get('name'));
        editCode = myStore.peekRecord('department', this.get('id'));
        
        editCode.set('name', this.get('name'));

        var f = myStore.peekRecord('faculty', this.get('faculty'));
        f.get('departments').pushObject(editCode);
        this.set('departmentDrop', false);
      }
      else if(this.get('flag')=="program-administration"){
        console.log(this.get('name'));
        editCode = myStore.peekRecord('program-administration', this.get('id'));
        
        var d = myStore.peekRecord('department', this.get('department'));
        d.get('programAdministrations').pushObject(editCode);
        this.set('facultyDrop', false);
      }
      
      console.log(JSON.stringify(editCode));
      //newCode.set('body', '"body": "test"' );
      editCode.save();
      
      this.set('name',"");
      this.set('isEditing', false);
      //this.get('routing').transitionTo('');

    },
    
    deleteCode: function() {
      if(confirm('Are you sure you want to delete this gender?')){
                console.log(this.get('id'));
                var myStore = this.get('store');
                
                var genderData = myStore.peekRecord(this.get('flag'), this.get('id')); //Can only peek at records if record has been already loaded to the page
                console.log(genderData.get('name'));
                
                genderData.deleteRecord(); // Deletes record locally
                genderData.save(); // Saves changes to database
            }
    },

    addNewCode: function () {
      this.set('isEditing', true);
      console.log("I am in add code");
      if(this.get('flag')=="program-administration"){
        this.set('departmentDrop', true);
      }
      else if(this.get('flag')=="department"){
        this.set('facultyDrop', true);
      }
    },
  
    cancel: function () {
      this.set('isEditing', false);
      
    }
  }
});
