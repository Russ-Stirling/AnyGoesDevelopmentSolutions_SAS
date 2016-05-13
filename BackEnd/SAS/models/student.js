var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var studentSchema = new Schema({
    studentID: String,
    firstName: String,
    lastName: String,
    dob: String,
    gender: {type: mongoose.Schema.ObjectId, ref: ('gender')},

    //student has one of these
    country: {type: mongoose.Schema.ObjectId, ref: ('country')},
    province: {type: mongoose.Schema.ObjectId, ref: ('province')},
    city: {type: mongoose.Schema.ObjectId, ref: ('city')},
    residency: {type: mongoose.Schema.ObjectId, ref: ('residency')},
    academicLoad: {type: mongoose.Schema.ObjectId, ref: ('academicLoad')},
    //highSchoolAdmissionAverage: {type: mongoose.Schema.ObjectId, ref: ('highSchoolAdmissionAverage')},
    //student can have many of these
    grades: [{type: mongoose.Schema.ObjectId, ref: ('grade')}],
    itrPrograms: [{type: mongoose.Schema.ObjectId, ref: 'itrProgram'}],
    //basisOfAdmissions: [{type: mongoose.Schema.ObjectId, ref: 'basisOfAdmission'}],
    
    distributionResults: [{type: mongoose.Schema.ObjectId, ref: 'distributionResult'}],
    //academicProgramHistories: [{type: mongoose.Schema.ObjectId, ref: 'academicProgramHistory'}],
    //secondarySchools: [{type: mongoose.Schema.ObjectId, ref: 'secondarySchool'}],
    //scholarAndAwardCodes: [{type: mongoose.Schema.ObjectId, ref: 'scholarAndAwardCode'}]

}, {
    versionKey: false // to disable the "__v" attribute
});
module.exports = mongoose.model('student', studentSchema);