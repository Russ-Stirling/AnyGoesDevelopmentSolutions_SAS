var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var highSchoolCoursesMarkSchema = mongoose.Schema({
    level: String,
    source: String,
    unit: String,
    grade: String,
    secondarySchool: {type: mongoose.Schema.ObjectId, ref: 'secondary-school'},
    highSchoolSubject: {type: mongoose.Schema.ObjectId, ref: 'high-school-subject'},
    
}, {
    versionKey: false // to disable the "__v" attribute
});

module.exports = mongoose.model('highSchoolCourseMark', highSchoolCoursesMarkSchema);