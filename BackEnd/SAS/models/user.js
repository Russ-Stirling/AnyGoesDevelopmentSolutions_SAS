var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = mongoose.Schema({
    firstName: String,
        lastName: String,
        email: String,
        enabled: Boolean,
        userShadow: {type: mongoose.Schema.ObjectId, ref: ('password')},
        userRoles: [{type: mongoose.Schema.ObjectId, ref: 'userRole'}],
    
}, {
    versionKey: false // to disable the "__v" attribute
});

module.exports = mongoose.model('user', userSchema);