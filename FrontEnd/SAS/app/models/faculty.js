import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  departments: DS.hasMany('department', {async: true})
});
