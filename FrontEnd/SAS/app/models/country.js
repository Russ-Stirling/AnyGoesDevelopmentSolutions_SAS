import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr(),
    provinces: DS.hasMany('province', { async: true}),
    students: DS.hasMany('student', { async: true})
});
