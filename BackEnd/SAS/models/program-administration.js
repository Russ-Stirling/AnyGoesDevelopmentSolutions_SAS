var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var programAdministrationSchema = mongoose.Schema({
    name: String,
    position: String,
    academicProgramCode: {type: mongoose.Schema.ObjectId, ref: 'academicProgramCode'},
    department: {type: mongoose.Schema.ObjectId, ref: 'department'}
}, {
    versionKey: false // to disable the "__v" attribute
});

module.exports = mongoose.model('programAdministration', programAdministrationSchema);