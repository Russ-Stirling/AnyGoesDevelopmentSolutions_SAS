import Ember from 'ember';

export default Ember.Component.extend({
  isEditing: false,
  addingCourseAverage: false,
  average: false,
  first: false,
  endBrackets: "",
  store: Ember.inject.service(),
  flag: null,
  rule: "",
  operator: "",
  expression: "",
  frontBrackets: "",
  ruleType: "",
  courseCode: "",
  academicProgramCode: null,
  routing: Ember.inject.service('-routing'),
  sortingCourses: ['name:asc'],
  logicalExpression: [],
  AR001IsPermitted: Ember.computed(function(){ //Edit User
    var authentication = this.get('oudaAuth');
    if (authentication.getName === "Root") {
      return true;
    } else {
      return (authentication.get('userCList').indexOf("AR001") >= 0);
    }
  }),
  academicProgramsModel: Ember.computed('isEditing', function(){
    // Ember.Logger.log("Hello");
    return this.get('store').findAll('academic-program-code');
  }),
  
  courseCodesModel: Ember.computed('isEditing', function(){
    // Ember.Logger.log("Hello");
    return this.get('store').findAll('course-code');
  }),
  
  sortedCourseCodes: Ember.computed.sort('courseCodesModel', 'sortingCourses'),

  actions: {
    selectRuleType(ruleType){
      this.set('ruleType', ruleType);
      if(ruleType == "CourseMark"){
        this.set('addingCourseAverage', true);
      }
      else{
        this.set('addingCourseAverage', false);
      }
    },
    selectFrontBrackets(brackets){
      this.set('frontBrackets', brackets);
    },
    selectEndBrackets(brackets){
      this.set('endBrackets', brackets);
    },
    saveLine(){
      var myStore = this.get('store');
      if(this.get('ruleType')==="CourseMark")
      {
        var s = myStore.peekRecord('course-code', this.get('courseCode'));
      
        this.get('logicalExpression').pushObject({
          frontBracket: this.get('frontBrackets'),
          ruleType: this.get('ruleType'),
          course: s.get('name'),
          courseID: this.get('courseCode'),
          expression: this.get('operator'),
          value: this.get('grade'),
          endBracket: this.get('endBrackets'),
          logic: this.get('expression'),
        });
      }
      else{
        this.get('logicalExpression').pushObject({
          frontBracket: this.get('frontBrackets'),
          ruleType: this.get('ruleType'),
          course: "",
          courseID: "",
          expression: this.get('operator'),
          value: this.get('grade'),
          endBracket: this.get('endBrackets'),
          logic: this.get('expression'),
        });
      }

    },
    selectOperator(opr){
      this.set('operator', opr);
    },
    selectExpression(exp){
      this.set('expression', exp);
    },
    selectAcademicProgram(academicProgramCode){
      console.log(this.get("academicProgramCode"));
      this.set('academic-program-code', academicProgramCode);
    },
    selectCourse(courseCode){
      this.set('courseCode', courseCode);
      //this
    },
    setRule(rule){
      if(rule==="studentAverage"){
        this.set("average", true);
        this.set("first", false);
      }
      else if(rule==="firstConsideration"){
        this.set("first", true);
        this.set("average", false);
      }
    },
    savePost: function () {
      var myStore = this.get('store');
      var descr = this.get('description');
      
      var newCode = myStore.createRecord('admission-rule', {
        description: descr
      });
      
      var a = myStore.peekRecord('academicProgramCode', this.get('academic-program-code'));
      a.get('admissionRules').pushObject(newCode);
      var frame = this;
      newCode.save().then(function(adRule){
        console.log('now i will create the logical expression');
        
        var logicalExpressionString = "";
        frame.get('logicalExpression').forEach(function(line, indexOf){
          logicalExpressionString += line.frontBracket+","+line.ruleType+","+line.courseID+","+line.expression+","+line.value+","+line.endBracket+","+line.logic+":";
        });
        console.log(logicalExpressionString);
        var expres = myStore.createRecord('logicalExpression', {
          booleanExp: logicalExpressionString
        });
        
        adRule.get('logicalExpressions').pushObject(expres);
        
        expres.save();
        frame.get('logicalExpression').clear();
        frame.set('isEditing', false);
      });

    },

    addNewCode: function () {
      this.get('logicalExpression').clear();
      this.set('isEditing', true);
    },

    cancel: function () {
      this.get('logicalExpression').clear();
      this.set('isEditing', false);
    }
  }
});