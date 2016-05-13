import DS from 'ember-data';

export default DS.Model.extend({
    code: DS.attr(),
    progAction: DS.attr(),
    description: DS.attr(),
    notes: DS.attr(),
    distributionResult: DS.belongsTo('distributionResult', {async: true})
  
});