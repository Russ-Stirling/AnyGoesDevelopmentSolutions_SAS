var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var highSchoolAdmissionAverageSchema = mongoose.Schema({
    first: String,
    midYear: String,
    final: String,
    grade11: String,
    student: {type: mongoose.Schema.ObjectId, ref: 'student'}
    
}, {
    versionKey: false // to disable the "__v" attribute
});

module.exports = mongoose.model('highSchoolAdmissionAverage', highSchoolAdmissionAverageSchema);