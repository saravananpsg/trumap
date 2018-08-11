'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  path = require('path'),
  db = require(path.resolve('./src/config/lib/sequelize')),
  config = require(path.resolve('./src/config/config')),
  passport = require('passport'),
  jwt = require('jwt-simple'),
  moment = require('moment');

var Op = db.Sequelize.Op;

exports.requiresLoginToken = function(req, res, next) {
      // check for login token here
      var loginToken =  req.body.token || req.query.token || req.headers.authorization;

      if(loginToken) {
        loginToken = loginToken.replace('Bearer ','');
        // query DB for the user corresponding to the token and act accordingly
        db.User.findOne({
          where: {
            loginToken: loginToken,
            loginExpires: {
              [Op.gt]: moment().format()
            }
          }
        })
        .then((user) => {
          if(!user){
            return res.status(200).json({
              data: {
                messages: 'Token is incorrect or has expired. Please login again'
              }
              });
          }
          req.user = user;
          next();
          return null;
        })
        .catch((err) => {
          return res.status(200).json({
              data: {
                messages: 'There was an internal server error processing your login token'
              }
          });
        })
      } else {
        return res.status(200).json({
          data: {
            messages: 'Token is incorrect or has expired. Please login again'
          }
        });
      }
};

exports.requiresTokenValidity = function(req, res, next) {
  var loginToken =  req.body.token || req.query.token || req.headers.authorization;
  if(!loginToken || loginToken == undefined) next();
  loginToken = loginToken.replace('Bearer ', '');
  var payload = jwt.decode(loginToken, config.token.secret);
  if(payload.exp && (payload.exp > (Date.now()/1000))) {
    console.log('Token Valid:', loginToken);
  } else {
    console.log('Token Invalid:', loginToken);
  }
  next();
};
/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {
  db.User
    .findOne({
      where: {
        id: id
      },
      include: [{
        all: true
      }]
    })
    .then(function(user) {
      if (!user) {
        return next(new Error('Failed to load User ' + id));
      } else {
        req.profile = user;
        next();
      }
    })
    .catch(function(error) {
      return next(error);
    });
};
