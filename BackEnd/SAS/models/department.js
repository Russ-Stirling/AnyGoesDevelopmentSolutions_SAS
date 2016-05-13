var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var departmentSchema = mongoose.Schema({
    name: String,
    programAdministration: [{type: mongoose.Schema.ObjectId, ref: 'program-administration'}],
    faculty: {type: mongoose.Schema.ObjectId, ref: 'faculty'}
}, {
    versionKey: false // to disable the "__v" attribute
});

module.exports = mongoose.model('department', departmentSchema);

