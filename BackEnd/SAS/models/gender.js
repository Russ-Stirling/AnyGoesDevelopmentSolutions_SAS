var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var genderSchema = mongoose.Schema({
    name: String,
    students: [{type: mongoose.Schema.ObjectId, ref: 'student'}]

    //id: String
}, {
    versionKey: false // to disable the "__v" attribute
});
module.exports = mongoose.model('gender', genderSchema);