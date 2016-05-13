var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var provinceSchema = mongoose.Schema({
    name: String,
    country: {type: mongoose.Schema.ObjectId, ref: ('country')},
    cities: [{type: mongoose.Schema.ObjectId, ref: 'city'}],
    students: [{type: mongoose.Schema.ObjectId, ref: 'student'}]
}, {
    versionKey: false // to disable the "__v" attribute
});
module.exports = mongoose.model('province', provinceSchema);