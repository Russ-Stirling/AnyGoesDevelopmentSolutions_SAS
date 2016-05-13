var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var countrySchema = mongoose.Schema({
    name: String,
    provinces: [{type: mongoose.Schema.ObjectId, ref: 'province'}],
    students: [{type: mongoose.Schema.ObjectId, ref: 'student'}]
}, {
    versionKey: false // to disable the "__v" attribute
});
module.exports = mongoose.model('country', countrySchema);