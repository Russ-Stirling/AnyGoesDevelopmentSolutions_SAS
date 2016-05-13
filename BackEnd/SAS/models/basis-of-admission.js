var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var basisOfAdmissionSchema = mongoose.Schema({
    date: String,
    comment: String,
    student: {type: mongoose.Schema.ObjectId, ref: 'student'},
    basisOfAdmissionCode: {type: mongoose.Schema.ObjectId, ref: 'basis-of-admission'}
    //students: DS.hasMany('student', { async: true})
}, {
    versionKey: false // to disable the "__v" attribute
});

module.exports = mongoose.model('basisOfAdmission', basisOfAdmissionSchema);