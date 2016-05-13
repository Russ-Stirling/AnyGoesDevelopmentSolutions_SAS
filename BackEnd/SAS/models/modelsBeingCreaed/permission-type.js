var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var permissionTypeSchema = mongoose.Schema({
    name: String,
    rolePermission: {type: mongoose.Schema.ObjectId, ref: 'role-permission'}
    
}, {
    versionKey: false // to disable the "__v" attribute
});

module.exports = mongoose.model('permissionType', permissionTypeSchema);