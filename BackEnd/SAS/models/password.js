var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var passwordSchema = mongoose.Schema({
    userName: String,
        salt: String,
        encryptedPassword: String,
        userAccountExpiryDate: Date,
        passwordMustChanged : Boolean,
        passwordReset: Boolean,
        user: {type: mongoose.Schema.ObjectId, ref: ('user')},
}, {
    versionKey: false // to disable the "__v" attribute
});

module.exports = mongoose.model('password', passwordSchema);