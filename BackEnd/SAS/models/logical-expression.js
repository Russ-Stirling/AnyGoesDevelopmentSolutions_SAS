var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var logicalExpressionSchema = mongoose.Schema({
    booleanExp: String,
    logicalLink: String,
    
    admissionRule: {type: mongoose.Schema.ObjectId, ref: 'admissionRule'},
    
    //logicalExpressions: [{type: mongoose.Schema.ObjectId, ref: 'logicalExpression'}],
    //logicalExpression: {type: mongoose.Schema.ObjectId, ref: 'logicalExpression'}
}, {
    versionKey: false // to disable the "__v" attribute
});

module.exports = mongoose.model('logicalExpression', logicalExpressionSchema);