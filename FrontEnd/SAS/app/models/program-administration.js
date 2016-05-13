import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr(),
    position: DS.attr(),
    academicProgramCode: DS.belongsTo('academicProgramCode', {async: true}),
    department: DS.belongsTo('department', {async: true})
});
