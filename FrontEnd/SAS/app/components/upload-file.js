import Ember from 'ember';
/* global XLSX */

export default Ember.Component.extend({
    isEditing: false,
    type: null,
    store: Ember.inject.service(),
    academicProgramCode: null,
    userMessage: "Select a type of file to import",
    routing: Ember.inject.service('-routing'),
    UF001IsPermitted: Ember.computed(function(){ //Edit User
        var authentication = this.get('oudaAuth');
        if (authentication.getName === "Root") {
          return true;
        } else {
          return (authentication.get('userCList').indexOf("UF001") >= 0);
        }
    }),
    actions:{
        selectDataType(dataType){
          this.set('type', dataType);
        },
        uploadNewFile: function(){
            this.set('isEditing', true);
            console.log(this.get('isEditing'));
        },
        fileLoaded: function(file) {
      
            var workbook = XLSX.read(file.data, {type: 'binary'});
            var myStore = this.get('store');
            var sheet_name_list = workbook.SheetNames;
            var code;
            var myName;

            
            var myObject = [];
              //iterate through all sheets
            if(this.get('type')==="genders"){
              sheet_name_list.forEach(function(y) {
                var worksheet = workbook.Sheets[y];
                for (var z in worksheet) {
                //all keys that do not begin with "!" correspond to cell addresses 
                //y is sheet name
                //z is cell name
                //worksheet[z].v is data
                  if(z[0] === '!') continue;
                  if((z[1]=="1")&&(!(z[2]))){console.log("column title");}
                  else{
                    myName = (worksheet[z].v);
                    myObject.pushObject({name: myName});
                  }
                  console.log(y + "!" + z + "=" + (worksheet[z].v));
                }
              });
              
              myObject.forEach(function(g){
                code = myStore.createRecord('gender', {
                  name: g.name
                });
                code.save();
              });
              myObject.clear();
              
            } //tested import without deleting
            
            else if(this.get('type')==="students"){ //this will be tricky
              //number	firstName	lastName	gender	DOB	residency
              myObject.clear();
              var snumber = null;
              var sFname = null;
              var sLname = null;
              var sgender = null;
              var sDOB = null;
              var sres = null;
              var sitrs = [];
                sheet_name_list.forEach(function(y) {
                var worksheet = workbook.Sheets[y];
                for (var z in worksheet) {
                //all keys that do not begin with "!" correspond to cell addresses 
                //y is sheet name
                //z is cell name
                //worksheet[z].v is data
                  if(z[0] === '!') continue;
                  if((z[1]=="1")&&(!(z[2]))){console.log("column title");}
                  else{
                    if(z[0]=="A"){
                      snumber = (worksheet[z].v);
                    }
                    else if(z[0]=="B"){
                      sFname = (worksheet[z].v);
                    }
                    else if(z[0]=="C"){
                      sLname = (worksheet[z].v);
                    }
                    else if(z[0]=="D"){
                      sgender = (worksheet[z].v);
                    }
                    else if(z[0]=="E"){
                      sDOB = (worksheet[z].v);
                    }
                    else if(z[0]=="F"){
                      sres = (worksheet[z].v);
                    }
                    else if (z[0]=="G"){
                      sitrs = (worksheet[z].v).split(",");
                      myObject.pushObject({
                        studentID: snumber,
                        firstName: sFname,
                        lastName: sLname,
                        gender: sgender,
                        dob: sDOB,
                        residency: sres,
                        itrs: sitrs
                      });
                    }
                  }
                  //console.log(y + "!" + z + "=" + (worksheet[z].v));
                }
              });
              
              myObject.forEach(function(s){
                myStore.queryRecord('gender', {name : s.gender}).then(function(genderModel){
                  myStore.queryRecord('residency', {name : s.residency}).then(function(resModel){
                    code = myStore.createRecord('student', {
                      firstName: s.firstName,
                      lastName: s.lastName,
                      studentID: s.studentID,
                      dob: s.dob
                    });
                    genderModel.get('students').pushObject(code);
                    resModel.get('students').pushObject(code);
                    code.save().then(function(createdStudent){
                      var itrCode;
                      s.itrs.forEach(function(itrInstance, indexOf){
                        myStore.queryRecord('academicProgramCode', {name : itrInstance}).then(function(accModel){
                          itrCode = myStore.createRecord('itrProgram',{
                            order: indexOf,
                            eligibility: "TBD"
                          });
                          accModel.get('itrPrograms').pushObject(itrCode);
                          createdStudent.get('itrPrograms').pushObject(itrCode);
                          itrCode.save();
                        });
                      });
                    });
                  });
                });
                console.log("Checking data in the objects");
              });
              
              
            } //it works. Creates students, itrs, references to itrs-genders-res, itr reference to student
            //note does not handle location or academic load yet as this was not provided in mock data
            else if(this.get('type')==="programRecords"){ //this will be the hardest
              var rSid = "";
              var rCourseCode = "";
              var rCourseNum = "";
              var rCourseSec = "";
              var rCourseName = "";
              var rCourseUnit = "";
              var rCourseMark = "";
              var rLevel = "";
              var rStatus = "";
              var rComment = "";
              var rPlan = "";
              var rTerm = "";
              var record = "";
              var rIndex = 0;
              
              myObject.clear();
              sheet_name_list.forEach(function(y) {
                var worksheet = workbook.Sheets[y];
                for (var z in worksheet) {
                
                //all keys that do not begin with "!" correspond to cell addresses 
                //y is sheet name
                //z is cell name
                //worksheet[z].v is data
                  if(z[0] === '!') continue;
                  if((z[1]=="1")&&(!(z[2]))){console.log("Column Title");}
                  else {
                    if(z[0]=="A"){ //student number
                      if(rIndex!=0){
                        myObject.pushObject({
                          studentID: rSid,
                          level: rLevel,
                          thestatus: rStatus,
                          comment: rComment,
                          plan: rPlan,
                          term: rTerm,
                          courses: record,
                        });
                      }
                      record="";
                      rSid = (worksheet[z].v);
                    }
                    else if(z[0]=="B"){ //record level
                      rLevel = (worksheet[z].v);
                    }
                    else if(z[0]=="C"){ //record status
                      rStatus = (worksheet[z].v);
                    }
                    else if(z[0]=="D"){ //record comment
                      rComment = (worksheet[z].v);
                    }
                    else if(z[0]=="E"){ //record plan
                      rPlan = (worksheet[z].v);
                    }
                    else if(z[0]=="F"){ //record term
                      rTerm = (worksheet[z].v);
                    }
                    else if(z[0]=="G"){ //course code
                      rCourseCode = (worksheet[z].v);
                    }
                    else if(z[0]=="H"){ //course number
                      rCourseNum = (worksheet[z].v);
                    }
                    else if(z[0]=="I"){ //course section
                      rCourseSec = (worksheet[z].v);
                    }
                    else if(z[0]=="J"){ //course name
                      rCourseName = (worksheet[z].v);
                    }
                    else if(z[0]=="K"){ //course unit
                      rCourseUnit = (worksheet[z].v);
                    }
                    else if(z[0]=="L"){ //course mark
                      rCourseMark = (worksheet[z].v);
                      record+=":"+rCourseCode+","+rCourseNum+","+rCourseSec+","+rCourseName+","+rCourseUnit+","+rCourseMark;
                      
                      rIndex=1;
                    }
                  }
                  //console.log(y + "!" + z + "=" + (worksheet[z].v));
                }
                myObject.pushObject({
                  studentID: rSid,
                  level: rLevel,
                  status: rStatus,
                  comment: rComment,
                  plan: rPlan,
                  term: rTerm,
                  courses: record,
                });
              });
              
              myObject.forEach(function(c){
                //var courseList = [];
                //var listItems = [];
                postRecord(c, myStore);
                /*
                myStore.queryRecord('termCode', {name: c.term}).then(function(theTerm){
                  myStore.queryRecord('degreeCode', {name: c.plan}).then(function(thePlan){
                    code = myStore.createRecord('programRecord', {
                      level: c.level,
                      status: c.thestatus,
                      comment: c.comment,
                    });
                    theTerm.get('programRecords').pushObject(code);
                    thePlan.get('programRecords').pushObject(code);
                    code.save().then(function(courseRecord){
                      courseList.clear();
                      //console.log(c.courses);
                      courseList = c.courses.split(":");
                      
                      courseList.forEach(function(oneCourse){
                        if(oneCourse==""){console.log("The empty string");}
                        else
                        {
                          console.log(oneCourse);
                          myStore.queryRecord('student', {studentID: c.studentID}).then(function(theStudent){
                            listItems.clear();
                            listItems = oneCourse.split(",");
                            myStore.queryRecord('courseCode', {
                              code: listItems[0],
                              number: listItems[1],
                            }).then(function(theCourse){
                              //console.log(listItems[5]);
                              var gradeCode = myStore.createRecord('grade', {
                                mark: listItems[5],
                                section: listItems[2]
                              });
                              theStudent.get('grades').pushObject(gradeCode);
                              theCourse.get('grades').pushObject(gradeCode);
                              courseRecord.get('grades').pushObject(gradeCode);
                              gradeCode.save();
                            });
                          });
                        }
                      });
                    });
                  });
                });
                */
              });
              
              
            } //need to do
            else if(this.get('type')==="residencies"){ //tested success
              sheet_name_list.forEach(function(y) {
                var worksheet = workbook.Sheets[y];
                for (var z in worksheet) {
                //all keys that do not begin with "!" correspond to cell addresses 
                //y is sheet name
                //z is cell name
                //worksheet[z].v is data
                  if(z[0] === '!') continue;
                  if((z[1]=="1")&&(!(z[2]))){console.log("column title");}
                  else{
                    myName = (worksheet[z].v);
                    myObject.pushObject({name: myName});
                  }
                  console.log(y + "!" + z + "=" + (worksheet[z].v));
                }
              });
              
              myObject.forEach(function(g){
                code = myStore.createRecord('residency', {
                  name: g.name
                });
                code.save();
              });
              myObject.clear();
              
            } //tested import without deleting
            else if(this.get('type')==="academicProgramCodes"){
                sheet_name_list.forEach(function(y) {
                var worksheet = workbook.Sheets[y];
                for (var z in worksheet) {
                //all keys that do not begin with "!" correspond to cell addresses 
                //y is sheet name
                //z is cell name
                //worksheet[z].v is data
                  if(z[0] === '!') continue;
                  if((z[1]=="1")&&(!(z[2]))){console.log("column title");}
                  else{
                    myName = (worksheet[z].v);
                    myObject.pushObject({name: myName});
                  }
                  console.log(y + "!" + z + "=" + (worksheet[z].v));
                }
              });
              
              myObject.forEach(function(a){
                code = myStore.createRecord('academicProgramCode', {
                  name: a.name
                });
                code.save();
              });
              myObject.clear();
            } //tested import without deleting
            else if(this.get('type')==="academicLoads"){
                sheet_name_list.forEach(function(y) {
                var worksheet = workbook.Sheets[y];
                for (var z in worksheet) {
                //all keys that do not begin with "!" correspond to cell addresses 
                //y is sheet name
                //z is cell name
                //worksheet[z].v is data
                  if(z[0] === '!') continue;
                  if((z[1]=="1")&&(!(z[2]))){console.log("column title");}
                  else{
                    myName = (worksheet[z].v);
                    myObject.pushObject({name: myName});
                  }
                  console.log(y + "!" + z + "=" + (worksheet[z].v));
                }
              });
              
              myObject.forEach(function(a){
                code = myStore.createRecord('academicLoad', {
                  name: a.name
                });
                code.save();
              });
              myObject.clear();
            } //tested import without deleting
            else if(this.get('type')==="courseCodes"){ //first challenge, multiple data fields
              var ccode=null;
              var cnumber=null;
              var cunit=null;
                sheet_name_list.forEach(function(y) {
                var worksheet = workbook.Sheets[y];
                for (var z in worksheet) {
                //all keys that do not begin with "!" correspond to cell addresses 
                //y is sheet name
                //z is cell name
                //worksheet[z].v is data
                  if(z[0] === '!') continue;
                  if((z[1]=="1")&&(!(z[2]))){console.log("column title");}
                  else{
                    if(z[0]=="A"){
                      ccode = (worksheet[z].v);
                    }
                    else if(z[0]=="B"){
                      cnumber = (worksheet[z].v);
                    }
                    else if(z[0]=="C"){
                      myName = (worksheet[z].v);
                    }
                    else if(z[0]=="D"){
                      cunit = (worksheet[z].v);
                      myObject.pushObject({
                        code: ccode,
                        number: cnumber,
                        name: myName,
                        unit: cunit
                      });
                    }
                  }
                  console.log(y + "!" + z + "=" + (worksheet[z].v));
                }
              });
              
              myObject.forEach(function(g){
                code = myStore.createRecord('courseCode', {
                  code: g.code,
                  number: g.number,
                  name: g.name,
                  unit: g.unit
                });
                code.save();
              });
              myObject.clear();
            } //tested import without deleting
            else if(this.get('type')==="termCodes"){ //tested success
                sheet_name_list.forEach(function(y) {
                var worksheet = workbook.Sheets[y];
                for (var z in worksheet) {
                //all keys that do not begin with "!" correspond to cell addresses 
                //y is sheet name
                //z is cell name
                //worksheet[z].v is data
                  if(z[0] === '!') continue;
                  if((z[1]=="1")&&(!(z[2]))){console.log("column title");}
                  else{
                    myName = (worksheet[z].v);
                    myObject.pushObject({name: myName});
                  }
                  console.log(y + "!" + z + "=" + (worksheet[z].v));
                }
              });
              
              myObject.forEach(function(t){
                code = myStore.createRecord('termCode', {
                  name: t.name
                });
                code.save();
              });
              myObject.clear();
            } //tested import without deleting
            else if(this.get('type')==="degreeCodes"){ //tested success
                sheet_name_list.forEach(function(y) {
                var worksheet = workbook.Sheets[y];
                for (var z in worksheet) {
                //all keys that do not begin with "!" correspond to cell addresses 
                //y is sheet name
                //z is cell name
                //worksheet[z].v is data
                  if(z[0] === '!') continue;
                  if((z[1]=="1")&&(!(z[2]))){console.log("column title");}
                  else{
                    myName = (worksheet[z].v);
                    myObject.pushObject({name: myName});
                  }
                  console.log(y + "!" + z + "=" + (worksheet[z].v));
                }
              });
              
              myObject.forEach(function(d){
                code = myStore.createRecord('degreeCode', {
                  name: d.name
                });
                code.save();
              });
              myObject.clear();
            } //tested import without deleting
            else if(this.get('type')==="faculties"){
                sheet_name_list.forEach(function(y) {
                var worksheet = workbook.Sheets[y];
                for (var z in worksheet) {
                //all keys that do not begin with "!" correspond to cell addresses 
                //y is sheet name
                //z is cell name
                //worksheet[z].v is data
                  if(z[0] === '!') continue;
                  if((z[1]=="1")&&(!(z[2]))){console.log("column title");}
                  else{
                    myName = (worksheet[z].v);
                    myObject.pushObject({name: myName});
                  }
                  console.log(y + "!" + z + "=" + (worksheet[z].v));
                }
              });
              
              myObject.forEach(function(f){
                code = myStore.createRecord('faculty', {
                  name: f.name
                });
                code.save();
              });
              myObject.clear();
            } //tested import without deleting
            else if(this.get('type')==="departments"){ //first object reference medium difficulty
            var facultyName;
              sheet_name_list.forEach(function(y) {
                var worksheet = workbook.Sheets[y];
                
                for (var z in worksheet) {
                //all keys that do not begin with "!" correspond to cell addresses 
                //y is sheet name
                //z is cell name
                //worksheet[z].v is data
                  if(z[0] === '!') continue;
                  if((z[1]=="1")&&(!(z[2]))){console.log("column title");}
                  else{
                    if(z[0]=="A"){
                      myName = (worksheet[z].v);
                    }
                    else if(z[0]=="B"){
                      facultyName = (worksheet[z].v);
                      myObject.pushObject({
                        name: myName,
                        faculty: facultyName
                      });
                    }
                    
                  }
                  console.log(y + "!" + z + "=" + (worksheet[z].v));
                }
              });
              
              myObject.forEach(function(g){
                myStore.queryRecord('faculty', {name : g.faculty}).then(function(facultyModel){
                  code = myStore.createRecord('department', {
                    name: g.name
                  });
                  //find the faculty and 
                  facultyModel.get('departments').pushObject(code);
                  code.save();
                });
              });
                
              myObject.clear();
            } //tested import without deleting, also succefully references the faculty it belongs to
            else if(this.get('type')==="programAdministrations"){ //not doing yet
                
            } //should do
            else if(this.get('type')==="admissionRules"){ //this will be tricky
                
            } //should do
            else{
              console.log("This option is not in the database");
            } //if they do a selection not in the database
            this.set('userMessage', "Records imported for", this.get('type'));
              
      	},
    }
    
});

function postRecord(c, myStore){
  var courseList = [];
  var listItem = [];
  myStore.queryRecord('termCode', {name: c.term}).then(function(theTerm){
    myStore.queryRecord('degreeCode', {name: c.plan}).then(function(thePlan){
      var code = myStore.createRecord('programRecord', {
        level: c.level,
        status: c.thestatus,
        comment: c.comment,
      });
      theTerm.get('programRecords').pushObject(code);
      thePlan.get('programRecords').pushObject(code);
      code.save().then(function(courseRecord){
        courseList.clear();
        //console.log(c.courses);
        courseList = c.courses.split(":");
                      
        courseList.forEach(function(oneCourse){
          postGrade(oneCourse, myStore, c, courseRecord);
        });
      });
    });
  });
};

function postGrade(oneCourse, myStore, c, courseRecord){
  var listItems = [];
  if(oneCourse==""){console.log("The empty string");}
  else
  {
    console.log(oneCourse);
    myStore.queryRecord('student', {studentID: c.studentID}).then(function(theStudent){
      listItems.clear();
      listItems = oneCourse.split(",");
      myStore.queryRecord('courseCode', {
        code: listItems[0],
        number: listItems[1],
      }).then(function(theCourse){
        //console.log(listItems[5]);
        var gradeCode = myStore.createRecord('grade', {
          mark: listItems[5],
          section: listItems[2]
        });
        theStudent.get('grades').pushObject(gradeCode);
        theCourse.get('grades').pushObject(gradeCode);
        courseRecord.get('grades').pushObject(gradeCode);
        gradeCode.save();
      });
    });
  }
};