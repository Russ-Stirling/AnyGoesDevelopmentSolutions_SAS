import DS from 'ember-data';

export default DS.Model.extend({
    booleanExp: DS.attr(),
    logicalLink: DS.attr(),
    
    admissionRule: DS.belongsTo('admissionRule', {async: true}),
    
    //logicalExpressions: DS.hasMany('logicalExpression', {async:true}),
    //logicalExpression: DS.belongsTo('logicalExpression', {async:true})
});
