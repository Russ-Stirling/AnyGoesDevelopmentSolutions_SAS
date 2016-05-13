import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr(),
    province: DS.belongsTo('province', { async: true}),
    students: DS.hasMany('student', { async: true})
  
});
