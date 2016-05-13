var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userRoleSchema = mongoose.Schema({
    dateAssigned: Date,
    user: {type: mongoose.Schema.ObjectId, ref: ('user')},
    role: {type: mongoose.Schema.ObjectId, ref: ('roleCode')}
    
}, {
    versionKey: false // to disable the "__v" attribute
});

module.exports = mongoose.model('userRole', userRoleSchema);