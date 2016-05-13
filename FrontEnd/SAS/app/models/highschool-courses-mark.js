import DS from 'ember-data';

export default DS.Model.extend({
    level: DS.attr(),
    source: DS.attr(),
    unit: DS.attr(),
    grade: DS.attr(),
    secondarySchool: DS.belongsTo('secondarySchool', {async: true}),
    highSchoolSubject: DS.belongsTo('highSchoolSubject', {async: true}),
});
