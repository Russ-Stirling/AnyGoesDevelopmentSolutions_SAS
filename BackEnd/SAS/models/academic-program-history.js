var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var academicProgramHistorySchema = mongoose.Schema({
    startDate: String,
    endDate: String,
    status: String,
    plan: String,
    student: {type: mongoose.Schema.ObjectId, ref: 'student'},
    academicProgramCode: {type: mongoose.Schema.ObjectId, ref: 'academicProgramHistory'}
    //students: DS.hasMany('student', { async: true})
}, {
    versionKey: false // to disable the "__v" attribute
});

module.exports = mongoose.model('academicProgramHistory', academicProgramHistorySchema);