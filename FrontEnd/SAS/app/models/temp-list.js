import DS from 'ember-data';

export default DS.Model.extend({
    grade: DS.attr(),
    section: DS.attr(),
    courseCode: DS.attr(),
    level: DS.attr(),
    status: DS.attr(),
    comment: DS.attr(),
    degreeCodetermCode: DS.attr(),
    termCode: DS.attr(),
    unit:DS.attr()

});