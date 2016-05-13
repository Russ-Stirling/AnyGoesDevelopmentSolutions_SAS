import Ember from 'ember';

export default Ember.Component.extend({
    distributed: false,
    order: 0,
    wait:0,
    hideD: false,
    store: Ember.inject.service(),
    routing: Ember.inject.service('-routing'),
    studentList: [],
    grades: [],
    maxSizes: [],
    rulesAccepted: false,
    allStudentGrades: [],
    sortingCourses: ['program.name:asc'],
    sortedStudents: Ember.computed.sort('studentList', 'sortingCourses'),
    sortedItrs: Ember.computed.sort('studentList', 'sortingCourses'),
    
    D001IsPermitted: Ember.computed(function(){ //Edit User
        var authentication = this.get('oudaAuth');
        if (authentication.getName === "Root") {
          return true;
        } else {
          return (authentication.get('userCList').indexOf("D001") >= 0);
        }
    }),
    actions:{
        queries: function(){
            var myStore = this.get('store');
            deleteAllDistribution(myStore);
            var frame = this;
            //myStore.findAll('academicProgramCode');
            myStore.findAll('student').then(function(allstudents){allstudents.forEach(function(student){
               //console.log(student.get('id)'));
               myStore.query('grade', {student: student.get('id')}).then(function(allGrades){
                  allGrades.forEach(function(grade){
                      myStore.findRecord('courseCode', grade.get('courseCode.id')).then(function(course){
                          frame.get('allStudentGrades').pushObject({
                              student: student.get('id'),
                              mark: grade.get('mark'),
                              unit: course.get('unit'),
                              course: course.get('id')
                          });
                          //console.log(frame.get('allStudentGrades').length);
                      });
                  });
               });
            });});
            
            this.set('rulesAccepted', true);
            this.set('hideD', false);
            this.get('studentList').clear();
        },
        distribute: function(){
            this.get('studentList').clear();
            var myStore = this.get('store');
            this.get('maxSizes').clear();
            this.set('hideD', true);
            
            var frame = this;
            var studentCheck = "test";
            var total = parseFloat('0');
            var size = parseFloat('0');
            var studentAverages = [];
            var test = this.get('allStudentGrades').sortBy("student");
            test.forEach(function(grade, indexOf){
                console.log(grade.student);
                var x, y, oneAvg;
                if(grade.student==studentCheck)
                {
                    x = parseFloat(grade.mark);
                    y = parseFloat(grade.unit);
                    total = total + (x*y);
                    size = size + y;
                    if (indexOf == test.length-1)
                    {
                        oneAvg = total/size;
                        studentAverages.pushObject({
                            avg : oneAvg,
                            student : studentCheck
                        });
                    }
                }
                else
                {
                    oneAvg = total/size;
                    if(studentCheck!=="test")
                    {
                        studentAverages.pushObject({
                            avg : oneAvg,
                            student : studentCheck
                        });
                    }
                    studentCheck = grade.student;
                    total = parseFloat('0');
                    size = parseFloat('0');
                    x = parseFloat(grade.mark);
                    y = parseFloat(grade.unit);
                    total = total + (x*y);
                    size = size + y;
                }
            });
            
            var sortedStudents = studentAverages.sortBy("avg");
            //Ember.run.later(function() {
                for (var i = sortedStudents.length-1; i>-1; i--)
                {
                    console.log(sortedStudents[i].avg);
                    console.log(sortedStudents[i].student);
                    getITRs(sortedStudents[i].student, sortedStudents[i].avg, myStore, frame);
                }
            //}, 1000);
            Ember.run.later(function() {
                var sizes = frame.get('maxSizes').uniq();
                for (var i = sortedStudents.length-1; i>-1; i--)
                {
                    console.log(sortedStudents[i].avg);
                    distributeThem(sortedStudents[i].student, myStore, frame, sizes);
                }
            }, 30000);

            
        },
        
        showDistribution: function(){
            this.get('studentList').clear();
            var frame = this;
            var myStore = this.get('store');
            myStore.findAll('student').then(function(students){
               students.forEach(function(s){
                   myStore.queryRecord('distributionResult', {student: s.get('id')}).then(function(d){
                       //console.log(d.get('id'));
                        myStore.queryRecord('commentCode', {distributionResult: d.get('id')}).then(function(c){
                            var ac = myStore.peekRecord('academicProgramCode', c.get('description'));
                            if(!ac){
                               ac={name:c.get('description')};
                            }
                            
                            frame.get('studentList').pushObject({
                                studentName: s.get('firstName')+" "+s.get('lastName'),
                                id: s.get('studentID'),
                                accept: c.get('progAction'),
                                program: ac
                           });
                       });
                   });
               });
            });
            
            this.set('rulesAccepted', false);
            this.set('distributed', true);
        },
        hideDistribution: function(){
            //var myStore =this.get('store');
            //myStore.findAll('academicProgramCode');
            this.get('studentList').clear();
            this.set('distributed', false);
            this.set('rulesAccepted', false);
        }
    }
});

function getITRs(student, avg, myStore, frame){
    
    myStore.query('itrProgram', {
        student: student
    }).then(function(itrs){
        var t = itrs.sortBy("order");
        t.forEach(function(itr){
            itr.set('eligibility', "TBD");
            //itr.save();
            var ac = myStore.peekRecord('academic-program-code', itr.get('academicProgramCode.id'));
            var adRules = ac.get('admissionRules');
            //console.log(ac.get('name'), "     ", itr.get('order'));
            adRules.forEach(function(adRule){
                checkRule(myStore, itr, avg, student, adRule, ac, frame);
            });
            return null;
        });
    });
};

function checkRule(myStore, itr, avg, student, adRule, ac, frame){
    //console.log("second before");
                            
    myStore.query('logicalExpression', {admissionRule: adRule.get('id')}).then(function(logical){
        logical.forEach(function(exp){
            //console.log(exp);
            var expString = exp.get('booleanExp');
            //console.log(student, avg, ac.get('name'),"    the boolean expression   ",exp.get('booleanExp'));
            var result = expString.split(":");
            result.forEach(function(h){
                if(h==""){frame.set('wait', frame.get('wait')+1);}
                var r = h.split(",");
                var signType;
                
                if(r[1]=="CumulativeAverage")
                {
                    signType = r[3];
                    var reqAvg = r[4];
                    avgCheck(itr, student, avg, reqAvg, signType);
                }
                else if(r[1]=="DisciplineVolume")
                {
                    signType = r[3];
                    var maxVol = r[4];
                    sizeCheck(itr, maxVol, ac, frame);
                }
                else if(r[1]=="CourseMark")
                {
                    var reqCourse = r[2];
                    signType = r[3];
                    var reqMark = r[4];
                    courseCheck(itr, student, reqCourse, reqMark, signType, myStore);
                    
                }
               //console.log(h);
            });
            
        });
    }).then(function(){console.log("when do i appear");})
    console.log(itr.get('eligibility'));
    return true;
};

function avgCheck(itr, student, avg, reqAvg, sign){
    var x = parseFloat(avg);
    var y = parseFloat(reqAvg);
    console.log(itr.get('eligibility'));
    if((itr.get('eligibility')=="ineligible, 350")||(itr.get('eligibility')=="ineligible, 365")){return false;}
    if(sign == ">")
    {
        if(x>y){
            itr.set('eligibility', "eligible");
            itr.save();
            return true;
        }
        else{
            itr.set('eligibility', "ineligible, 350");
            itr.save();
            return false;
        }
    }
    else if(sign == ">=")
    {
        if(x>=y){
            itr.set('eligibility', "eligible");
            itr.save();
            return true;
        }
        else{
            itr.set('eligibility', "ineligible, 350");
            itr.save();
            return false;
        }
    }
    else if(sign == "<")
    {
        if(x<y){
            itr.set('eligibility', "eligible");
            itr.save();
            return true;
        }
        else{
            itr.set('eligibility', "ineligible, 350");
            itr.save();
            return false;
        }
    }
    else if(sign == "<=")
    {
        if(x<=y){
            itr.set('eligibility', "eligible");
            itr.save();
            return true;
        }
        else{
            itr.set('eligibility', "ineligible, 350");
            itr.save();
            return false;
        }
    }
    else if(sign == "=")
    {
        if(x==y){
            itr.set('eligibility', "eligible");
            itr.save();
            return true;
        }
        else{
            itr.set('eligibility', "ineligible, 350");
            itr.save();
            return false;
        }
    }
}; //complete?

function sizeCheck(itr, maxSize, ac, frame){
    
    frame.get('maxSizes').pushObject({
        program: ac.get('name'),
        maxS: maxSize,
        currentS: 0
    });
    if((itr.get('eligibility')=="ineligible, 350")||(itr.get('eligibility')=="ineligible, 365")){return false;}
    itr.set('eligibility', "eligible");
    itr.save();
    return true;
    
}; //not complete

function courseCheck(itr, student, course, reqMark, sign, myStore){
    myStore.queryRecord('grade', {
        student: student,
        courseCode: course
    }).then(function(g){
        if(!g){
            itr.set('eligibility', "ineligible");
            itr.save();
            return false;
        }
        console.log(g.get('mark'))
        var x = parseFloat(g.get('mark'));
        var y = parseFloat(reqMark);
        console.log(itr.get('eligibility'));
        if((itr.get('eligibility')=="ineligible, 350")||(itr.get('eligibility')=="ineligible, 365")){return false;}
        if(sign == ">")
        {
            if(x>y){
                itr.set('eligibility', "eligible");
                itr.save();
                return true;
            }
            else{
                itr.set('eligibility', "ineligible, 365");
                itr.save();
                return false;
            }
        }
        else if(sign == ">=")
        {
            if(x>=y){
                itr.set('eligibility', "eligible");
                itr.save();
                return true;
            }
            else{
                itr.set('eligibility', "ineligible, 365");
                itr.save();
                return false;
            }
        }
        else if(sign == "<")
        {
            if(x<y){
                itr.set('eligibility', "eligible");
                itr.save();
                return true;
            }
            else{
                itr.set('eligibility', "ineligible, 365");
                itr.save();
                return false;
            }
        }
        else if(sign == "<=")
        {
            if(x<=y){
                itr.set('eligibility', "eligible");
                itr.save();
                return true;
            }
            else{
                itr.set('eligibility', "ineligible, 365");
                itr.save();
                return false;
            }
        }
        else if(sign == "=")
        {
            if(x==y){
                itr.set('eligibility', "eligible");
                itr.save();
                return true;
            }
            else{
                itr.set('eligibility', "ineligible, 365");
                itr.save();
                return false;
            }
        }
    });
}; ////complete?

function distributeThem(student, myStore, frame, sizes){
    myStore.query('itrProgram', {student: student}).then(function(itrs){
        var undistributed = true;
        var s = myStore.peekRecord('student', student);
        var reason;
        var disResult;
        var i = itrs.sortBy('order');
        i.forEach(function(itr){
            var ac = myStore.peekRecord('academicProgramCode', itr.get('academicProgramCode.id'));
            reason = itr.get('eligibility');
            if((itr.get('eligibility')=="eligible")&&(undistributed))
            {
                var size = sizes.findBy("program", ac.get('name'));
                if(size==undefined)
                {
                    //size.currentS= size.currentS+1;
                    undistributed = false;
                    frame.get('studentList').pushObject({
                        studentName: s.get('firstName')+" "+s.get('lastName'),
                        id: s.get('studentID'),
                        accept: "Accepted",
                        program: itr.get('academicProgramCode')
                    });
                    disResult = myStore.createRecord('distributionResult', {
                        date: new Date()
                    });
                    s.get('distributionResults').pushObject(disResult);
                    disResult.save().then(function(code){
                        var commentC = myStore.createRecord('commentCode', {
                            code: "200",
                            progAction: "Accepted",
                            description: itr.get('academicProgramCode.id'),
                            notes: null
                        });
                        code.get('commentCodes').pushObject(commentC);
                        commentC.save();
                    });
                    //now create a distribution result and comment code
                }
                else if((size.currentS>=size.maxS))
                {
                    reason = "Program Full";
                }
                
                else
                {
                    size.currentS= size.currentS+1;
                    undistributed = false;
                    frame.get('studentList').pushObject({
                        studentName: s.get('firstName')+" "+s.get('lastName'),
                        id: s.get('studentID'),
                        accept: "Accepted",
                        program: itr.get('academicProgramCode')
                    });
                    console.log(frame.get('Date'));
                    disResult = myStore.createRecord('distributionResult', {
                        date: new Date()
                    });
                    s.get('distributionResults').pushObject(disResult);
                    disResult.save().then(function(code){
                        var commentC = myStore.createRecord('commentCode', {
                            code: "200",
                            progAction: "Accepted",
                            description: itr.get('academicProgramCode.id'),
                            notes: null
                        });
                        code.get('commentCodes').pushObject(commentC);
                        commentC.save();
                    });
                    //now create a distribution result and comment code
                    
                }
                
            }
        });
        
        if(undistributed){
            frame.get('studentList').pushObject({
                studentName: s.get('firstName')+" "+s.get('lastName'),
                id: s.get('studentID'),
                accept: "Declined",
                program: {name: reason}
            });
            disResult = myStore.createRecord('distributionResult', {
                date: new Date()
            });
            s.get('distributionResults').pushObject(disResult);
            var q = reason.split(",");
            disResult.save().then(function(code){
                var commentC = myStore.createRecord('commentCode', {
                    code: q[1],
                    progAction: "Declined",
                    description: reason,
                    notes: null
                });
                code.get('commentCodes').pushObject(commentC);
                commentC.save();
            });
            //now create a distribution result and comment code
        }
        frame.set('distributed', true);
    });
};

function deleteAllDistribution(myStore){
    
    myStore.findAll('commentCode').then(function(record){
        record.forEach(function(rec) {
            Ember.run.once(this, function() {
               rec.deleteRecord();
               rec.save();
            });
        }, this);
    });
    
    myStore.findAll('distributionResult').then(function(record){
        record.forEach(function(rec) {
            Ember.run.once(this, function() {
               rec.deleteRecord();
               rec.save();
            });
        }, this);
    });
  
}