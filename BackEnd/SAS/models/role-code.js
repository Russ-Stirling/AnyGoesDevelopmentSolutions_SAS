var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roleCodeSchema = mongoose.Schema({
    name: String,
    userRoles: [{type: mongoose.Schema.ObjectId, ref: 'userRole'}],
    features: [{type: mongoose.Schema.ObjectId, ref: 'rolePermission'}]
    
}, {
    versionKey: false // to disable the "__v" attribute
});

module.exports = mongoose.model('roleCode', roleCodeSchema);