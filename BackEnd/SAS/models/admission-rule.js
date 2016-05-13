var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var admissionRuleSchema = mongoose.Schema({
    description: String,
    academicProgramCode: {type: mongoose.Schema.ObjectId, ref: 'academicProgramCode'},
    logicalExpressions: [{type: mongoose.Schema.ObjectId, ref: 'logicalExpression'}]
}, {
    versionKey: false // to disable the "__v" attribute
});

module.exports = mongoose.model('admissionRule', admissionRuleSchema);