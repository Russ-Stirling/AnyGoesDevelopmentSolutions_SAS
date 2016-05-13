var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Password = require('../models/password');
var RoleCode = require('../models/role-code');
var UserRole = require('../models/user-role');
var RolePermission = require('../models/role-permission');
var Login = require('../models/login');
var Root = require('../models/root');

var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();
const crypto = require('crypto');
var rand = require('csprng');

function hash(text) {
    const hash = crypto.createHash('sha256');
    hash.update(text);
    return hash.digest('binary');
};

function encrypt(plainText) {
    var cipher = crypto.createCipher('aes256', 'SE3350b Winter 2016');
    var crypted = cipher.update(plainText, 'ascii', 'binary');
    crypted += cipher.final('binary');
    return crypted;
};

function decrypt(cipherText) {
    var decipher = crypto.createDecipher('aes256', 'SE3350b Winter 2016');
    var dec = decipher.update(cipherText, 'binary', 'ascii');
    dec += decipher.final('ascii');
    return dec;
};

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var Salt = rand(256, 36);
        var EncryptedPassword = hash(request.body.password.encryptedPassword + Salt);
        var newUserShadow = new Password({
            salt : Salt,
            encryptedPassword : EncryptedPassword,
            userName: request.body.password.userName,
            passwordMustChanged: request.body.password.passwordMustChanged,
            userAccountExpiryDate: request.body.password.userAccountExpiryDate,
            user: request.body.password.user

        });

        newUserShadow.save(function (error) {
            if (error) {
                response.send({error: error});
            }
            else {
                response.json({password: newUserShadow});
            }
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var PasswordData = request.query.filter;
        if (!PasswordData) {
            Password.find(function (error, UserShadow) {
                if (error) response.send(error);
                response.json({password: UserShadow});
            });
        } else {
            if (PasswordData.user) {
                Password.findOne({"user": PasswordData.user}, function (error, UserShadow) {
                    if (error) response.send(error);
                    response.json({password: UserShadow});
                });
            } else {
                if (PasswordData.userName){
                    Password.findOne({"userName": PasswordData.userName}, function (error, UserShadow) {
                        if (error) response.send(error);
                        response.json({password: UserShadow});
                    });
                }
            }

        }
    });

router.route('/:password_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        Password.findById(request.params.password_id, function (error, UserShadow) {
            if (error) {
                response.send({error: error});
            }
            else {
                response.json({password: UserShadow});
            }
        });
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        Password.findById(request.params.password_id, function (error, UserShadow) {
            if (error) {
                response.send({error: error});
            }
            else {
                if (request.body.password.passwordMustChanged) {
                    var Salt = rand(256, 36);
                    console.log("password " + request.body.password.encryptedPassword);
                    console.log("salt " + Salt);
                    console.log("password + salt " + request.body.password.encryptedPassword + Salt);
                    console.log("hasedpassword " + hash(request.body.password.encryptedPassword + Salt));
                    UserShadow.encryptedPassword = hash(request.body.password.encryptedPassword + Salt);
                    UserShadow.salt = Salt;
                    UserShadow.passwordMustChanged = false;
                }
                UserShadow.passwordReset = request.body.password.passwordReset;
                UserShadow.userName = request.body.password.userName;
                UserShadow.userAccountExpiryDate = request.body.password.userAccountExpiryDate;
                UserShadow.user = request.body.password.user;

                UserShadow.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({password: UserShadow});
                    }
                });
            }
        });
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        Password.findByIdAndRemove(request.params.password_id,
            function (error, deleted) {
                if (!error) {
                    response.json({password: deleted});
                };
            }
        );
    });

module.exports = router;
