import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr(),
    students: DS.hasMany('student', { async: true}),
    highSchoolCoursesMark: DS.hasMany('highSchoolCoursesMark', { async: true})
});
