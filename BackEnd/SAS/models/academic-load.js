var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var academicLoadSchema = mongoose.Schema({
    name: String,
    students: [{type: mongoose.Schema.ObjectId, ref: 'student'}]
}, {
    versionKey: false // to disable the "__v" attribute
});

module.exports = mongoose.model('academicLoad', academicLoadSchema);