var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var scholarAndAwardCodeSchema = mongoose.Schema({
    name: String,
    student: {type: mongoose.Schema.ObjectId, ref: 'student'},
    
}, {
    versionKey: false // to disable the "__v" attribute
});

module.exports = mongoose.model('scholarAndAwardCode', scholarAndAwardCodeSchema);