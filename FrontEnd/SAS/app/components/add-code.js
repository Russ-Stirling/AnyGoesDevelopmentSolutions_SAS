import Ember from 'ember';

export default Ember.Component.extend({
  isEditing: false,
  nameBox: false,
  basisofa: false,
  highschoolavg: false,
  highschoolCourse: false,
  markAndSubjectDrop: false,
  departmentDrop: false,
  facultyDrop: false,
  store: Ember.inject.service(),
  flag: null,
  faculty: null,
  department: null,
  academicProgramCode: null,
  secondarySchool: null,
  highschoolSubject: null,
  routing: Ember.inject.service('-routing'),
  AC001IsPermitted: Ember.computed(function(){ //Edit User
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("AC001") >= 0);
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
  academicProgramCodesModel: Ember.computed('isEditing', function(){
    return this.get('store').findAll('academicProgramCode');
  }),
  secondarySchoolModel: Ember.computed('isEditing', function(){
    return this.get('store').findAll('secondarySchool');
  }),
  highschoolSubjectModel: Ember.computed('isEditing', function(){
    return this.get('store').findAll('highschoolSubject');
  }),
  
  actions: {
    selectFaculty(faculty){
      this.set('faculty', faculty);
    },
    selectDepartment(department){
      this.set('department', department);
    },
    selectAcademicProgramCode(program){
      this.set('academicProgramCode', program);
    },
    selectSecondarySchool(school){
      this.set('secondarySchool', school);
    },
    selectHighschoolSubject(subject){
      this.set('highschoolSubject', subject);
    },
    savePost: function () {
      var newCode;
      var myStore;
      if(this.get('flag')==="gender"){
        myStore = this.get('store');
        console.log(this.get('name'));
        newCode = myStore.createRecord('gender', {name: this.get('name')});
      }
      else if(this.get('flag')==="residency"){
        myStore = this.get('store');
        newCode = myStore.createRecord('residency', {
        name: this.get('name')
      });
      }
      else if(this.get('flag')==="academic-load"){
        myStore = this.get('store');
        newCode = myStore.createRecord('academic-load', {
        name: this.get('name')
      });
      }
      else if(this.get('flag')==="itr-program"){
        //Do nothing itr's are created when the student is created.
        //myStore = this.get('store');
        //newCode = myStore.createRecord('itr-program', {
        //name: this.get('name')
      //});
      }
      else if(this.get('flag')==="academic-program-code"){
        myStore = this.get('store');
        newCode = myStore.createRecord('academic-program-code', {
          name: this.get('name')
          
        });
      }
      else if(this.get('flag')==="faculty"){
        myStore = this.get('store');
        newCode = myStore.createRecord('faculty', {
          name: this.get('name')
      });
      }
      else if(this.get('flag')==="term-code"){
        myStore = this.get('store');
        newCode = myStore.createRecord('term-code', {
          name: this.get('name')
      });
      }
      else if(this.get('flag')==="degree-code"){
        myStore = this.get('store');
        newCode = myStore.createRecord('degree-code', {
          name: this.get('name')
      });
      }
      else if(this.get('flag')=="department"){
        myStore = this.get('store');
        console.log(this.get('name'));
        newCode = myStore.createRecord('department', {
          name: this.get('name')
        });
        
        this.set('departmentDrop', false);

        var f = myStore.peekRecord('faculty', this.get('faculty'));
        f.get('departments').pushObject(newCode);
      }
      else if(this.get('flag')=="program-administration"){
        myStore = this.get('store');
        console.log(this.get('name'));
        newCode = myStore.createRecord('program-administration', {
          name: this.get('name'),
          position: this.get('position')
        });
        
        this.set('facultyDrop', false);

        var d = myStore.peekRecord('department', this.get('department'));
        d.get('programAdministrations').pushObject(newCode);
        var a = myStore.peekRecord('academicProgramCode', this.get('academicProgramCode'));
        a.get('programAdministrations').pushObject(newCode);
        
      }
      else if(this.get('flag')=="basisOfAdmissionCode"){
        myStore = this.get('store');
        newCode = myStore.createRecord('basisOfAdmissionCode', {
          name: this.get('name')
        });
      }
      else if(this.get('flag')=="basisOfAdmission"){
        myStore = this.get('store');
        newCode = myStore.createRecord('basisOfAdmission', {
          date: this.get('date'),
          comment: this.get('comment')
        });
        this.set('basisofa', false);
      }
      else if(this.get('flag')=="highschoolAdmissionAverage"){
        myStore = this.get('store');
        newCode = myStore.createRecord('highschoolAdmissionAverage', {
          first: this.get('first'),
          midYear: this.get('midyear'),
          final: this.get('final'),
          gr11: this.get('gr11'),
        });
        this.set('highschoolavg', false);
      }
      else if(this.get('flag')=="scholarAndAwardCode"){
        myStore = this.get('store');
        newCode = myStore.createRecord('scholarAndAwardCode', {
          name: this.get('name')
        });
      }
      else if(this.get('flag')=="secondaySchool"){
        myStore = this.get('store');
        newCode = myStore.createRecord('secondaySchool', {
          name: this.get('name')
        });
      }
      else if(this.get('flag')=="highschoolSubject"){
        myStore = this.get('store');
        newCode = myStore.createRecord('secondaySchool', {
          name: this.get('name'),
          description: this.get('description')
        });
        this.set('highschoolCourse', false);
      }
      else if(this.get('flag')=="highschoolCourseMark"){
        myStore = this.get('store');
        console.log(this.get('name'));
        newCode = myStore.createRecord('highschoolCourseMark', {
          level: this.get('level'),
          source: this.get('source'),
          unit: this.get('unit'),
          grade: this.get('grade')
        });

        var s = myStore.peekRecord('secondarySchool', this.get('secondarySchool'));
        s.get('highschoolCourseMark').pushObject(newCode);
        var c = myStore.peekRecord('highschoolSubject', this.get('highschoolSubject'));
        c.get('highschoolCourseMark').pushObject(newCode);
        
        this.set('markAndSubjectDrop', false);
      }
      console.log(JSON.stringify(newCode));
      //newCode.set('body', '"body": "test"' );
      newCode.save();
      
      this.set('name',"");
      this.set('isEditing', false);
      //this.get('routing').transitionTo('');

    },

    addNewCode: function () {
      this.set('isEditing', true);
      console.log("I am in add code");
      if(this.get('flag')=="program-administration"){
        this.set('departmentDrop', true);
        this.set('nameBox', true);
      }
      else if(this.get('flag')=="department"){
        this.set('facultyDrop', true);
        this.set('nameBox', true);
      }
      else if(this.get('flag')=="basisOfAdmission"){
        this.set('basisofa', true);
      }
      else if(this.get('flag')=="highschoolAdmissionAverage"){
        this.set('highschoolavg', true);
      }
      else if(this.get('flag')=="highschoolSubject"){
        this.set('highschoolCourse', true);
      }
      else if(this.get('flag')=="highschoolCourseMark"){
        this.set('markAndSubjectDrop', true);
      }
      else{
        this.set('nameBox', true);
      }
    },
    cancel: function () {
      this.set('isEditing', false);
      
    }
  }
});
