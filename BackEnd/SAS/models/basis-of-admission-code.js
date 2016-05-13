var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var basisOfAdmissionCodeSchema = mongoose.Schema({
    name: String,
    basisOfAdmission: {type: mongoose.Schema.ObjectId, ref: 'student'},
    
    
}, {
    versionKey: false // to disable the "__v" attribute
});

module.exports = mongoose.model('basisOfAdmissionCode', basisOfAdmissionCodeSchema);