import DS from 'ember-data';

export default DS.Model.extend({
  studentID: DS.attr(),
  firstName: DS.attr(),
  lastName: DS.attr(),
  dob: DS.attr(),
  //for when there is one object to reference:
  country: DS.belongsTo('country', { async: true}),
  province: DS.belongsTo('province', { async: true}),
  city: DS.belongsTo('city', { async: true}),
  residency: DS.belongsTo('residency', { async: true}),
  gender: DS.belongsTo('gender', { async: true}),
  academicLoad: DS.belongsTo('academicLoad', { async: true}),
  //highSchoolAdmissionAverage: DS.belongTo('highSchoolAdmissionAverage', { async: true}),
  //for ones that have many attributes you need to create an array like this:
  itrPrograms: DS.hasMany('itrProgram', { async: true}),
  //basisOfAdmissions: DS.hasMany('basisOfAdmission', { async: true}),
  //programLevels: DS.hasMany('basisOfAdmission', { async: true}),
  distributionResults: DS.hasMany('distributionResult', { async: true}),
  grades: DS.hasMany('grade', {async:true})
  //academicProgramHistories: DS.hasMany('academicProgramHistory', { async: true}),
  //secondarySchools: DS.hasMany('secondarySchool', { async: true}),
  //scholarAndAwardCodes:DS.hasMany('scholarAndAwardCode', { async: true})
  
});
