var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var highSchoolSubjectSchema = mongoose.Schema({
    name: String,
    description: String,
    highSchoolCoursesMark: [{type: mongoose.Schema.ObjectId, ref: 'high-school-courses-mark'}],
    
}, {
    versionKey: false // to disable the "__v" attribute
});

module.exports = mongoose.model('highSchoolSubject', highSchoolSubjectSchema);