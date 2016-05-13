import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr(),
    basisOfAdmission: DS.belongsTo('basis-of-admission', {async: true}),
});
