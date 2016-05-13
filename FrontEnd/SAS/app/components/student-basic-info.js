import Ember from 'ember';

export default Ember.Component.extend({
    editState:0,
    store: Ember.inject.service(),
    routing: Ember.inject.service('-routing'),
    gender: null,
    newTermCheck: false,
    addNewCourse: false,
    showITR: false,
    showCourses: false,
    residency: null,
    country: null,
    termCode: null,
    province: null,
    city: null,
    academicLoad: null,
    genderID: null,
    residencyID: null,
    countryID: null,
    provinceID: null,
    cityID: null,
    academicLoadID: null,
    itrPrograms: [],
    newCountry: false,
    provinceChoosen: true,
    countryChoosen: true,
    gendM:false,
    termsArray: [],
    uniqueTermsArray:[],
    degreeArray: [],
    uniqueDegreeArray:[],
    resM:false,
    academM:false,
    counM:false,
    provM:false,
    cityM:false,
    origProv: null,
    origCoun: null,
    choiceList: [],
    sortingItrs: ['order:asc'],
    transcript: [],
    selected: null,
    above: null,
    VS002IsPermitted: Ember.computed(function(){ //Edit User
        var authentication = this.get('oudaAuth');
        if (authentication.getName === "Root") {
          return true;
        } else {
          return (authentication.get('userCList').indexOf("VS002") >= 0);
        }
    }),
    
    gendersModel: Ember.computed('editState', function(){
        return this.get('store').findAll('gender');
    }),
    residenciesModel: Ember.computed('editState', function(){
        return this.get('store').findAll('residency');
    }),
    academicLoadsModel: Ember.computed('editState', function(){
        return this.get('store').findAll('academicLoad');
    }),
    countriesModel: Ember.computed('editState', function(){
        return this.get('store').findAll('country');
    }),
    termCodesModel: Ember.computed('isEditing', function(){
   // Ember.Logger.log("Hello");
      return this.get('store').findAll('termCode');
    }),
    provincesModel: Ember.computed('countryChoosen', function(){
        return this.get('store').query('province', {country: this.get('countryID')});
    }),
    citiesModel: Ember.computed('provinceChoosen', function(){
        return this.get('store').query('city', {province: this.get('provinceID')});
    }),
    
    itrProgramsModel: Ember.computed('showITR', function(){
        return this.get('store').query('itrProgram', {student: this.get('selectedStudent.id')});
    }),
    
    academicProgramCodesModel: Ember.computed('showITR', function(){
        return this.get('store').findAll('academicProgramCode');
    }),
    courseCodesModel: Ember.computed('isEditing', function(){
    // Ember.Logger.log("Hello");
        return this.get('store').findAll('courseCode');
    }),
    sortedCourseCodes: Ember.computed.sort('courseCodesModel', 'sortingCourses'),
    
    sortedItrs: Ember.computed.sort('choiceList', 'sortingItrs'),
    
    actions:{
        selectGender(gender){
            this.set('gendM', true);
            this.set('genderID', gender);
        },
        selectResidency(residency){
            this.set('resM', true);
          this.set('residencyID', residency);
        },
        selectAcademicLoad(academicLoad){
            this.set('academM', true);
          this.set('academicLoadID', academicLoad);
        },
        selectTerm(termCode){
          this.set('termCode', termCode);
        },
        selectCourse(courseCode){
          this.set('courseCode', courseCode);
        },
        selectCountry(country){
            this.set('counM', true);
            this.set('provM', true);
            this.set('cityM', true);
          this.set('countryID', country);
          this.set('countryChoosen', false);
          this.set('provinceChoosen', false);
          this.set('countryChoosen', true);
    
        },
        selectProvince(province){
            this.set('provM', true);
            this.set('cityM', true);
          this.set('provinceID', province);
          this.set('provinceChoosen', false);
          this.set('provinceChoosen', true);
        },
        selectCity(city){
            this.set('cityM', true);
          this.set('cityID', city);
        },
        addNew(){
            console.log("I am trying to show the add courses shit");
            this.set('addNewCourse', true);
            
            var frame = this;
            this.get('transcript').forEach(function(t){
                frame.get('termsArray').pushObject(t.term);
            });
            this.set('uniqueTermsArray', this.get('termsArray').uniq());
        },
        showITR: function(){
            
            this.get('choiceList').clear();
            this.set('showITR', true);
            var myStore= this.get('store');
            var frame=this;
            console.log(this.get('selectedStudent.id'));

            
            myStore.query('itrProgram', {student: this.get('selectedStudent.id')}).then(function(models){
                models.forEach(function(model, index){
                    //frame.get('choiceList').pushObject(model);
                    frame.get('choiceList').pushObject({academicCode: model.get('academicProgramCode'), order: model.get('order'), id: model.get('id')});
                });
            });
            
            this.get('choiceList').sortBy('order:asc');
              /*
            //var test = this.get('sortedItrs');
            temp.forEach(function(model){
                //frame.get('choiceList').pushObject(model);
                console.log(model.get('academicProgramCode.id'));
                frame.get('choiceList').pushObject(model.get('academicProgramCode'));
            });
                
            /*
            myStore.peekAll('itrProgram').forEach(function(data, indexOf){
                console.log(indexOf);
                frame.get('choiceList').pushObject(myStore.peekRecord('academicProgramCode', data.get('id')));
            });  */
        },
        hideITR: function(){
            this.get('choiceList').clear();
            this.set('showITR', false);
        },
        showCourses: function(){
            this.get('transcript').clear();
            var frame = this;
            var myStore = this.get('store');
            
            myStore.query('grade', {student: this.get('selectedStudent.id')}).then(function(models){
                models.forEach(function(model, index){
                    //frame.get('choiceList').pushObject(model);
                    console.log(model.get('programRecord.id'));
                    myStore.queryRecord('termCode', {programRecords : model.get('programRecord.id')}).then(function(item){
                        //this.get('termsArray').pushObject(item);
                        myStore.queryRecord('degreeCode', {programRecords : model.get('programRecord.id')}).then(function(item2){
                            //myStore.findRecord('programRecord', model.get('programRecord.id')).then(function(p){
                                frame.get('transcript').pushObject({
                                    grade: model,
                                    course: model.get('courseCode'), 
                                    program: model.get('programRecord'),
                                    term: item.get('name'),
                                    degree: item2.get('name')
                                });
                            //});
                        });
                    });
                });
            });
            this.set('showCourses', true);
        },
        hideCourses: function(){
            this.get('transcript').clear();
            this.set('showCourses', false);
        },
        editBasicInfo: function(){
            if(this.get('editState')===0)
            {
                this.set('gender', this.get('selectedStudent.gender.name'));
                this.set('country', this.get('selectedStudent.country.name'));
                this.set('origCoun', this.get('selectedStudent.country.id'));
                this.set('countryID', this.get('selectedStudent.country.id'));
                this.set('province', this.get('selectedStudent.province.name'));
                this.set('origProv', this.get('selectedStudent.province.id'));
                this.set('provinceID', this.get('selectedStudent.province.id'));
                this.set('city', this.get('selectedStudent.city.name'));
                this.set('residency', this.get('selectedStudent.residency.name'));
                this.set('academicLoad', this.get('selectedStudent.academicLoad.name'));
            }
            this.set('provinceChoosen', false);
            this.set('countryChoosen', false);
            this.set('provinceChoosen', true);
            this.set('countryChoosen', true);
            this.set('editState', 1);
        },
        saveNewCourse: function(){
            var myStore = this.get('store');
            var frame = this;
            myStore.queryRecord('termCode', {name: this.get('termCode')}).then(function(t){
                if(frame.get('newTermCheck'))
                {
                    
                }
                else{
                    
                }
            })
            
            //Here is where we would save it.. hmmmm
        },
        cancelAddCourse: function(){
            this.set('addNewCourse', false);
        },
        saveEditedBasic: function(){
            //Here is where we do the saving edited info!
            var myStore = this.get('store');
            
            var s = myStore.peekRecord('student', this.get('selectedStudent.id'));
            
            s.set('firstName', this.get('selectedStudent.firstName'));
            s.set('dob', this.get('selectedStudent.dob'));
            s.set('lastName', this.get('selectedStudent.lastName'));
            
            if(this.get('gendM'))
            {
                var g = myStore.peekRecord('gender', this.get('genderID'));
                this.set('gender', g.get('name'));
                g.get('students').pushObject(s);
            }
            
            if(this.get('resM'))
            {
                var r = myStore.peekRecord('residency', this.get('residencyID'));
                this.set('residency', r.get('name'));
                r.get('students').pushObject(s);
            }
            
            if(this.get('academM'))
            {
                var a = myStore.peekRecord('academicLoad', this.get('academicLoadID'));
                this.set('academicLoad', a.get('name'));
                a.get('students').pushObject(s);
            }
            
            if(this.get('counM'))
            {
                var co = myStore.peekRecord('country', this.get('countryID'));
                this.set('country', co.get('name'));
                co.get('students').pushObject(s);
            }
            
            if(this.get('provM'))
            {
                var pr = myStore.peekRecord('province', this.get('provinceID'));
                this.set('province', pr.get('name'));
                pr.get('students').pushObject(s);
            }
            
            if(this.get('cityM'))
            {
                var ci = myStore.peekRecord('city', this.get('cityID'));
                this.set('city', ci.get('name'));
                ci.get('students').pushObject(s);
            }
            
            s.save(); //sends put
            this.set('gendM', false);
            this.set('academM', false);
            this.set('resM', false);
            this.set('counM', false);
            this.set('provM', false);
            this.set('cityM', false);
            this.set('editState', 2);
        },
        cancelEditedBasic: function(){
            //Here is where we cancel editing the info
            console.log(this.get('origCoun'));
            console.log(this.get('countryID'));
            this.set('countryID', this.get('origCoun'));
            this.set('provinceID', this.get('origProv'));
            console.log(this.get('origCoun'));
            console.log(this.get('countryID'));
            
            this.set('gendM', false);
            this.set('academM', false);
            this.set('resM', false);
            this.set('counM', false);
            this.set('provM', false);
            this.set('cityM', false);
            this.set('editState', 2);
        },
        goBack: function(){
            this.get('routing').transitionTo('students');
        },
        upAcademicProgramCode: function(i, o){
            console.log(o);
            if(o==0)
            {
                console.log("cant increase top priority");
            }
            else
            {
                this.set('selected', this.get('sortedItrs').objectAt(o));
                this.set('above', this.get('sortedItrs').objectAt(o-1));
                
                this.get('choiceList').removeObject(this.get('selected'));
                this.get('choiceList').removeObject(this.get('above'));
                
                this.set('selected.order', (o-1).toString());
                this.set('above.order', (o).toString());
                
                this.get('choiceList').pushObject(this.get('selected'));
                this.get('choiceList').pushObject(this.get('above'));
                
                this.set('showITR', false);
                this.set('showITR', true);
            }
            
        },
        downAcademicProgramCode: function(i, o){
            var x= o-(-1); //using addition actually wouldnt work so i had to subtract negative 1... seriously how the fuck does that work
            console.log(o);
            console.log(x);
            console.log(this.get('choiceList').length);
            if(o==this.get('choiceList').length-1)
            {
                console.log("cant decrease bottom priority");
            }
            else
            {
                this.set('selected', this.get('sortedItrs').objectAt(o));
                this.set('above', this.get('sortedItrs').objectAt(x));
                
                this.get('choiceList').removeObject(this.get('selected'));
                this.get('choiceList').removeObject(this.get('above'));
                //var x = o + 1;
                this.set('selected.order', (x).toString());
                this.set('above.order', (o).toString());
                
                this.get('choiceList').pushObject(this.get('selected'));
                this.get('choiceList').pushObject(this.get('above'));
                
                this.set('showITR', false);
                this.set('showITR', true);
            }
        },
        saveEditedITR: function(){
            var myStore = this.get('store');
            var temp;
            this.get('choiceList').forEach(function(model){
                temp=myStore.peekRecord('itrProgram', model.id);
                console.log(model.id);
                console.log(temp);
                temp.set('order', model.order);
                temp.save();
            });
            this.set('showITR', false);
        },
        
        removeCourse: function(i){
            var myStore = this.get('store');
            var x  = this.get('transcript').objectAt(i);
            var y = myStore.peekRecord('grade', x.grade.id);
            this.get('transcript').removeAt(i);
            y.deleteRecord();
            y.save();

        },
        
        saveNewCourse: function(){
            
        },
        cancelAddCourse: function(){
            this.set('newTermCheck', false);
            this.set('addNewCourse', false);
        },
        newTerm: function(){
            this.set('newTermCheck', true);
            
        }
        
    }
    
});
