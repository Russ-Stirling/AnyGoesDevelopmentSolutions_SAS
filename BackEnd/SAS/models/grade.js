var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gradeSchema = mongoose.Schema({
    mark: String,
    section: String,
    
    programRecord: {type: mongoose.Schema.ObjectId, ref: 'programRecord'},
    courseCode: {type: mongoose.Schema.ObjectId, ref: 'courseCode'},
    student: {type: mongoose.Schema.ObjectId, ref: 'student'}
    
}, {
    versionKey: false // to disable the "__v" attribute
});

module.exports = mongoose.model('grade', gradeSchema);
