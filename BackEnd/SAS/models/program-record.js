var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var programRecordSchema = mongoose.Schema({
    level: String,
    status: String,
    comment: String,
    grades: [{type: mongoose.Schema.ObjectId, ref: 'grade'}],
    degreeCode: {type: mongoose.Schema.ObjectId, ref: 'degreeCode'},
    termCode: {type: mongoose.Schema.ObjectId, ref: 'termCode'}
    //students: DS.hasMany('student', { async: true})
}, {
    versionKey: false // to disable the "__v" attribute
});

module.exports = mongoose.model('programRecord', programRecordSchema);
