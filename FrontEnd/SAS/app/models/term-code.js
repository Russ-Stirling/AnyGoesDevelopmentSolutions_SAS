import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  programRecords: DS.hasMany('programRecord', {async:true})
});
