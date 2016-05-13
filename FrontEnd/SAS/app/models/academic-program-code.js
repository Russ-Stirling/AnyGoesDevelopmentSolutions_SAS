import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr(),
    itrPrograms: DS.hasMany('itrProgram', { async: true}),
    admissionRules: DS.hasMany('admissionRule', { async: true}),
    programAdministrations: DS.hasMany('programAdministration', { async: true})
});
