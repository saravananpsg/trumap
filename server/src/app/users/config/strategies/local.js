'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  db = require(path.resolve('./src/config/lib/sequelize')),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  jwt = require('jwt-simple'),
  config = require(path.resolve('./src/config/config'));



module.exports = function() {
  // Use local strategy
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(username, password, done) {
    db.User.findOne({
      where: {
        username: username
      }
    })
    .then(function(user) {
      if (!user || !user.authenticate(user, password)) {
        done(null, false, 'Invalid username or password');

        return null;
      }

      done(null, user);

      return null;
    })
    .catch(function(err) {
      done(err);
    });
  }));

  passport.use('local-token', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, username, password, done) {
    var key = 'email';
    var query = {
      where: {}
    };
    query.where[key] = username;
    db.User.findOne(query)
    .then((user) => {
      if (!user) {
        return done(null, false,'Unknown user');
      }
      if(!user.authenticate(user, password)) {
        return done(null, false,'Invalid password');
      }
      // token expire time
      var expiresConfig =   (req.body.rememberMe) ?
        config.token.rememberMeExpires: config.token.defaultExpires;

        var expireTime = Date.now() + expiresConfig;
        // generate login token
        var tokenPayload = {
          email: user.email,
          name: user.name,
          role: user.role,
          system: user.system,
          rememberMe: req.body.rememberMe || false,
          exp: expireTime / 1000, // convert in seconds for client
        };

        var loginToken = jwt.encode(tokenPayload, config.token.secret);

        // add token and exp date to user object
        console.log('LOGIN TOKEN:', (loginToken.length), expireTime, expiresConfig);
        user.loginToken = loginToken;
        user.loginExpires = expireTime;
        user.rememberMe = req.body.rememberMe;

        user.save()
        .then((savedUser) => {
          done(null,savedUser);
          return null;
        })
        .catch((err) => {
          done(err);
          return null;
        })
      })
      .catch((err) => {
        console.log('PASSPORT: ERR:', err);
        done(err);
      });
    }
  ));
};
