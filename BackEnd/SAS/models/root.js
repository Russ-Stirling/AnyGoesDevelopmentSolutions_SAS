var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rootSchema = mongoose.Schema({
    password: String,
        nonce: String,
        response: String,
        wrongPassword: Boolean,
        sessionIsActive: Boolean
    
}, {
    versionKey: false // to disable the "__v" attribute
});

module.exports = mongoose.model('root', rootSchema);