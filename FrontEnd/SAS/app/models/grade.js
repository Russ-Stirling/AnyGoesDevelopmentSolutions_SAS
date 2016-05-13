import DS from 'ember-data';

export default DS.Model.extend({
    mark: DS.attr(),
    section: DS.attr(),
    student: DS.belongsTo('student', {async: true}),
    programRecord:DS.belongsTo('programRecord', {async: true}),
    courseCode: DS.belongsTo('courseCode', {async: true})
  
});
