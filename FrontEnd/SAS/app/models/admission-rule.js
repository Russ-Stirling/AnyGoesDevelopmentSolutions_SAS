import DS from 'ember-data';

export default DS.Model.extend({
    description: DS.attr(),
    
    academicProgramCode: DS.belongsTo('academicProgramCode', {async: true}),
    logicalExpressions: DS.hasMany('logicalExpression', {async: true})
  
});
