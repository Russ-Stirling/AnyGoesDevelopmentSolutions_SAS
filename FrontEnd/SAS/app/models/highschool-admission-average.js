import DS from 'ember-data';

export default DS.Model.extend({
    first: DS.attr(),
    midYear: DS.attr(),
    final: DS.attr(),
    grade11: DS.attr(),
    student: DS.belongsTo('student', {async: true}),
});
