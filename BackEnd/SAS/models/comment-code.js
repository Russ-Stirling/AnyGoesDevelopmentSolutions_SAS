var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentCodeSchema = mongoose.Schema({
    code: String,
    progAction: String,
    description: String,
    notes: String,
    distributionResult: {type: mongoose.Schema.ObjectId, ref: 'distributionResult'}
    //students: DS.hasMany('student', { async: true})
}, {
    versionKey: false // to disable the "__v" attribute
});

module.exports = mongoose.model('commentCode', commentCodeSchema);
