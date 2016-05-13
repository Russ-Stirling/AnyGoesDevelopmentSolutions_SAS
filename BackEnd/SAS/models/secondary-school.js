var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var secondarySchoolSchema = mongoose.Schema({
    name: String,
    student: {type: mongoose.Schema.ObjectId, ref: 'student'},
    highSchoolCoursesMark: {type: mongoose.Schema.ObjectId, ref: 'high-school-courses-mark'},
    
}, {
    versionKey: false // to disable the "__v" attribute
});

module.exports = mongoose.model('secondarySchool', secondarySchoolSchema);