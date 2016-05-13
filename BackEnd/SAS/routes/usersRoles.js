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

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var userRole = new UserRole(request.body.userRole);
        userRole.save(function (error) {
            if (error) response.send(error);
            response.json({userRole: userRole});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var User = request.query.filter;
        if (!User) {
            UserRole.find(function (error, userRoles) {
                if (error) response.send(error);
                response.json({userRole: userRoles});
            });
        } else {
            if (!User.user) {
                UserRole.find({"role": User.role}, function (error, userRoles) {
                    if (error) response.send(error);
                    response.json({userRole: userRoles});
                });
            } else {
                if (!User.role) {
                    UserRole.find({"user": User.user}, function (error, userRoles) {
                        if (error) response.send(error);
                        response.json({userRole: userRoles});
                    });
                } else {
                    UserRole.find({"user": User.user, "role": User.role}, function (error, userRoles) {
                        if (error) response.send(error);
                        response.json({userRole: userRoles});
                    });
                }
            }
        }

    });

router.route('/:userRole_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        UserRole.findById(request.params.userRole_id, function (error, userRole) {
            if (error) response.send(error);
            response.json({userRole: userRole});
        })
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        UserRole.findById(request.params.userRole_id, function (error, userRole) {
            if (error) {
                response.send({error: error});
            }
            else {
                userRole.dateAssigned = request.body.userRole.dateAssigned;
                userRole.user = request.body.userRole.user;
                userRole.role = request.body.userRole.role;
                userRole.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({userRole: userRole});
                    }
                });
            }
        })
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        UserRole.findByIdAndRemove(request.params.userRole_id,
            function (error, deleted) {
                if (!error) {
                    response.json({userRole: deleted});
                };
            }
        );
    });

module.exports = router;
