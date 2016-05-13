import DS from 'ember-data';

export default DS.Model.extend({
    date: DS.attr(),
    comment: DS.attr(),
    basisOfAdmissionCode: DS.belongsTo('basisOfAdmissionCode', {async: true}),
    student: DS.belongsTo('student', {async: true})
});
