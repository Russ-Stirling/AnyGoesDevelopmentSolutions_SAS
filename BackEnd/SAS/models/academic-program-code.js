var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var academicProgramCodeSchema = mongoose.Schema({
    name: String,
    itrPrograms: [{type: mongoose.Schema.ObjectId, ref: 'itrProgram'}],
    admissionRules: [{type: mongoose.Schema.ObjectId, ref: 'admissionRule'}],
    programAdministrations: [{type: mongoose.Schema.ObjectId, ref: 'programAdministration'}]
}, {
    versionKey: false // to disable the "__v" attribute
});

module.exports = mongoose.model('academicProgramCode', academicProgramCodeSchema);