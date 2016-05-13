var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var distributionResultSchema = mongoose.Schema({
    date: String,
    student: {type: mongoose.Schema.ObjectId, ref: 'student'},
    commentCodes: [{type: mongoose.Schema.ObjectId, ref: 'commentCode'}]
    //students: DS.hasMany('student', { async: true})
}, {
    versionKey: false // to disable the "__v" attribute
});

module.exports = mongoose.model('distributionResult', distributionResultSchema);
