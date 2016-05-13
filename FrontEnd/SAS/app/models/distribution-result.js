import DS from 'ember-data';

export default DS.Model.extend({
  date: DS.attr(),
  student: DS.belongsTo('student', {async: true}),
  commentCodes: DS.hasMany('commentCode', {async: true})
});
