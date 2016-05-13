import Ember from 'ember';
/* global XLSX */

export default Ember.Component.extend({
  fileinput: null,
  isEditing: false,
  firstPage: false,
  secondPage: false,
  countryChoosen: false,
  provinceChoosen: false,
  addingStudent: true,
  store: Ember.inject.service(),
  flag: null,
  gender: null,
  academicLoad: null,
  residency: null,
  termCode: null,
  degreeCode: null,
  courseCode: null,
  itrChoices: [],
  allItrs:[],
  itrStarted: true,
  routing: Ember.inject.service('-routing'),
  blah: [],
  addingTerm: true,
  termIndex: 0,
  termName: null,
  
  courseListDisplay: [],
  courseList: [],
  choiceList: [],
  sortingCourses: ['name:asc'],
  stud: null,
  AS001IsPermitted: Ember.computed(function(){ //Edit User
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("AS001") >= 0);
    }
  }),
  gendersModel: Ember.computed('isEditing', function(){
   // Ember.Logger.log("Hello");
    return this.get('store').findAll('gender');
  }),
  residenciesModel: Ember.computed('isEditing', function(){
   // Ember.Logger.log("Hello");
    return this.get('store').findAll('residency');
  }),
  academicLoadsModel: Ember.computed('isEditing', function(){
   // Ember.Logger.log("Hello");
    return this.get('store').findAll('academic-load');
  }),
  academicProgramCodesModel: Ember.computed('isEditing', function(){
   // Ember.Logger.log("Hello");
  }),
  countriesModel: Ember.computed('isEditing', function(){
    return this.get('store').findAll('country');
  }),
  provincesModel: Ember.computed('countryChoosen', function(){
    return this.get('store').query('province', {country: this.get('country')});
  }),
  citiesModel: Ember.computed('provinceChoosen', function(){
    return this.get('store').query('city', {province: this.get('province')});
  }),
  studentsModel: Ember.computed('isEditing', function(){
    return this.get('store').findAll('student');
  }),
  termCodesModel: Ember.computed('isEditing', function(){
   // Ember.Logger.log("Hello");
  return this.get('store').findAll('termCode');
  }),
  degreeCodesModel: Ember.computed('isEditing', function(){
    // Ember.Logger.log("Hello");
    return this.get('store').findAll('degreeCode');
  }),
  courseCodesModel: Ember.computed('isEditing', function(){
    // Ember.Logger.log("Hello");
    return this.get('store').findAll('courseCode');
  }),
  sortedCourseCodes: Ember.computed.sort('courseCodesModel', 'sortingCourses'),

  actions: {
    selectGender(gender){
      this.set('gender', gender);
    },
    selectResidency(residency){
      this.set('residency', residency);
    },
    selectAcademicLoad(academicLoad){
      this.set('academic-load', academicLoad);
    },
    chosenAcademicProgram: function(id, name, index){
      console.log(name);
      console.log(id);
      this.get('itrChoices').pushObject(id);
      this.get('choiceList').pushObject(name);
      this.get('allItrs').removeAt(index);
    },
    removedAcademicProgramCode: function(name, index){
      console.log(name);
      console.log(index);
      this.get('allItrs').insertAt(0, this.get('store').peekRecord('academic-program-code', this.get('itrChoices').objectAt(index)));
      this.get('itrChoices').removeAt(index);
      this.get('choiceList').removeAt(index);
    },
    selectCountry(country){
      this.set('country', country);
      this.set('countryChoosen', false);
      this.set('provinceChoosen', false);
      this.set('countryChoosen', true);

    },
    selectProvince(province){
      this.set('province', province);
      this.set('provinceChoosen', false);
      this.set('provinceChoosen', true);
    },
    selectCity(city){
      this.set('city', city);
    },
    selectTerm(termCode){
      this.set('termCode', termCode);
    },
    selectDegree(degreeCode){
      this.set('degreeCode', degreeCode);
    },
    selectCourse(courseCode){
      this.set('courseCode', courseCode);
    },

    savePost: function () {
      console.log(this.get('firstName'));
      console.log(this.get('lastName'));
      console.log(this.get('gender'));
      console.log(this.get('residency'));
      console.log(this.get('academic-load'));
      console.log(this.get('dob'));
      
      var myStore = this.get('store');
      var newCode = myStore.createRecord('student', {
        firstName: this.get('firstName'),
        lastName: this.get('lastName'),
        studentID: this.get('studentID'),
        dob: this.get('dob')
      });

      var g = myStore.peekRecord('gender', this.get('gender'));
      g.get('students').pushObject(newCode);
      
      var r = myStore.peekRecord('residency', this.get('residency'));
      r.get('students').pushObject(newCode);
      
      var aL = myStore.peekRecord('academic-load', this.get('academic-load'));
      aL.get('students').pushObject(newCode);
      
      var co = myStore.peekRecord('country', this.get('country'));
      co.get('students').pushObject(newCode);
      
      var p = myStore.peekRecord('province', this.get('province'));
      p.get('students').pushObject(newCode);
      
      var ci = myStore.peekRecord('city', this.get('city'));
      ci.get('students').pushObject(newCode);

      var frame=this;

      newCode.save().then(function(){
        myStore.queryRecord('student', {studentID: frame.get('studentID')}).then(function(data){
          console.log('saving itr programs');
          var newCode2;
          frame.get('itrChoices').forEach(function(code, indexOf){
            newCode2= myStore.createRecord('itrProgram', {
                order: indexOf,
                eligibility: "tbd"
            });
            
            var aP = myStore.peekRecord('academicProgramCode', code);
            aP.get('itrPrograms').pushObject(newCode2);
            data.get('itrPrograms').pushObject(newCode2);
            
            newCode2.save();
          });
          //start
          
          //needs to be edited starting here
          var newCodeProgramRecord;
          console.log('saving program record code');
          frame.get('blah').forEach(function(termEntry, indexOf){
            console.log('saving program record code 2');
                newCodeProgramRecord= myStore.createRecord('programRecord', {
                  level: termEntry.level,
                  status: termEntry.status,
                  comment: termEntry.comment,

                });
                console.log('degree code id');
                console.log(termEntry.degree.get('id'));
                var degr = myStore.peekRecord('degreeCode', termEntry.degree.id);
                degr.get('programRecords').pushObject(newCodeProgramRecord);
                
                console.log("Term code id: ");
                console.log(termEntry.term.get('id'));
                var term = myStore.peekRecord('termCode', termEntry.term.id);
                term.get('programRecords').pushObject(newCodeProgramRecord);

                newCodeProgramRecord.save().then(function(testIt){
                  console.log('saving grades');
                  var newCodeGrade;
                  termEntry.courses.forEach(function (course, index){
                    console.log("Please show the course id");
                    console.log(course.courseID);
                    var coursecode = myStore.peekRecord('courseCode', course.courseID);
                    newCodeGrade = myStore.createRecord('grade', {
                      mark: course.grade,
                      section: course.section
                    });
                    
                    coursecode.get('grades').pushObject(newCodeGrade);
                    testIt.get('grades').pushObject(newCodeGrade);
                    data.get('grades').pushObject(newCodeGrade);
                    
                    newCodeGrade.save();
                  });

                  frame.set('isEditing', true);
                  frame.set('isEditing', false);
                  
                });
              });
            });
          });
    },
    
    addTerm: function (termID, degreeID){
      var myStore = this.get('store');
      var t = myStore.peekRecord('termCode', termID);
      var d = myStore.peekRecord('degreeCode', degreeID);
      var a = [];

      console.log("testing something");
      console.log(t.id);
      this.get('blah').pushObject({
        term: t,
        degree: d,
        level: this.get('level'),
        status: this.get('status'),
        comment: this.get('comment'),
        courses: a
      });
      this.set('termName', t.get('name'));
      this.set('addingTerm', false);
      this.set('level', "");
      this.set('status', "");
      this.set('comment', "");
    },
    
    saveCourse: function() {
      var myStore = this.get('store');
      var coursesArray = this.get('blah').objectAt(this.get('termIndex'));
      var cour = myStore.peekRecord('course-code', this.get('courseCode'));

      //var temp=[];
      coursesArray.courses.pushObject({
        grade: this.get('grade'),
        section: this.get('section'),
        courseID: this.get('courseCode'),
        courseName: cour.get('name')
      });       //0

      /*
      temp.pushObject(this.get('level'));       //3
      temp.pushObject(this.get('status'));      //4
      temp.pushObject(this.get('comment'));     //5
      temp.pushObject(this.get('degreeCode'));  //6
      temp.pushObject(this.get('termCode'));    //7
      

      this.get('courseList').pushObject(temp);
      
      var cour = myStore.peekRecord('course-code', this.get('courseCode'));
      var degr = myStore.peekRecord('degree-code', this.get('degreeCode'));
      var termc = myStore.peekRecord('term-code', this.get('termCode'));
      
      var test = myStore.createRecord('tempList', {
        grade: temp[0],
        section: temp[1],
        courseCode: cour.get('name'),
        level: temp[3],
        status: temp[4],
        comment: temp[5],
        degreeCode: degr.get('name'),
        termCode: termc.get('name'),
      });
      */
      //this.get('courseListDisplay').pushObject(test);
      this.set('grade', "");
      this.set('section', "");
      //this.set('courseCode', "");
      
    },
    
    saveTerm: function () {
      this.set('termIndex', this.get('termIndex')+1);
      this.set('addingTerm', true);
    },
    
    editCourse: function(i) {
      console.log(i);
    },
    
    deleteCourse: function(i){
      console.log(i);
      this.get('courseList').removeAt(i);
      this.get('courseListDisplay').removeAt(i);
    },
    
    addNewCode: function () {
      this.get('courseList').clear();
      this.get('courseListDisplay').clear();
      this.get('choiceList').clear();
      this.get('allItrs').clear();
      
      var frame=this;
      this.get('store').findAll('academic-program-code').then(function(models){
        models.forEach(function(model, index){
          frame.get('allItrs').pushObject(model);
          
        });
        
      });
      this.set('isEditing', true);
      this.set('firstPage', true);
    },

    cancel: function () {
      this.set('isEditing', false);
    }
  }
});