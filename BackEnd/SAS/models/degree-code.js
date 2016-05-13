var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var degreeCodeSchema = mongoose.Schema({
    name: String,


    programRecords: [{type: mongoose.Schema.ObjectId, ref: 'programRecord'}]
}, {
    versionKey: false // to disable the "__v" attribute
});

module.exports = mongoose.model('degreeCode', degreeCodeSchema);