var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var termCodeSchema = mongoose.Schema({
    name: String,
    programRecords: [{type: mongoose.Schema.ObjectId, ref: 'programRecord'}]
    //students: DS.hasMany('student', { async: true})
}, {
    versionKey: false // to disable the "__v" attribute
});

module.exports = mongoose.model('termCode', termCodeSchema);