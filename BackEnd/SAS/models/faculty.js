var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var facultySchema = mongoose.Schema({
    name: String,
    departments: [{type: mongoose.Schema.ObjectId, ref: 'department'}]
}, {
    versionKey: false // to disable the "__v" attribute
});

module.exports = mongoose.model('faculty', facultySchema);

