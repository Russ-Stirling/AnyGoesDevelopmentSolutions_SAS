import DS from 'ember-data';

export default DS.Model.extend({
    tempId: DS.attr(),
    indexInArray: DS.attr(),
    studentID: DS.attr(),
  firstName: DS.attr(),
  lastName: DS.attr(),
  dob: DS.attr(),
  residency: DS.attr(),
  gender: DS.attr(),
  academicLoad: DS.attr(),
  country: DS.attr(),
  province: DS.attr(),
  city: DS.attr(),
  distributionResults: DS.attr(),	
  commentCodes: DS.attr()
});
