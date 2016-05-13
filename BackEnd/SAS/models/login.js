var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var loginSchema = mongoose.Schema({
        userName: String,
        password: String,
        nonce: String,
        response: String,
        token: String,
        requestType: String,
        wrongUserName: Boolean,
        wrongPassword: Boolean,
        passwordMustChanged: Boolean,
        passwordReset: Boolean,
        loginFailed: Boolean,
        sessionIsActive: Boolean
}, {
    versionKey: false // to disable the "__v" attribute
});

module.exports = mongoose.model('login', loginSchema);