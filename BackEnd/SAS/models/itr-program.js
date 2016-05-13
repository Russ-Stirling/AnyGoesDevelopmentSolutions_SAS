var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itrProgramSchema = mongoose.Schema({
    order: String,
    eligibility: String,
    student: {type: mongoose.Schema.ObjectId, ref: 'student'},
    academicProgramCode: {type: mongoose.Schema.ObjectId, ref: 'academicProgramCode'}

}, {
    versionKey: false // to disable the "__v" attribute
});

module.exports = mongoose.model('itrProgram', itrProgramSchema);