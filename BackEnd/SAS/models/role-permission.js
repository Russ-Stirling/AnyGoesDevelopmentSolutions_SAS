var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rolePermissionSchema = mongoose.Schema({
    code: String,
    sysFeature: String,
    roleCodes: [{type: mongoose.Schema.ObjectId, ref: ('roleCode')}],
    
}, {
    versionKey: false // to disable the "__v" attribute
});

module.exports = mongoose.model('rolePermission', rolePermissionSchema);