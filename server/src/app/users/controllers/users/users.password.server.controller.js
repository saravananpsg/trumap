'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  _ = require('lodash'),
  async = require('async'),
  config = require(path.resolve('./src/config/config')),
  crypto = require('crypto'),
  db = require(path.resolve('./src/config/lib/sequelize')),
  errorHandler = require(path.resolve('./src/app/core/controllers/errors.server.controller')),
  moment = require('moment'),
  nodemailer = require('nodemailer');


var Op = db.Sequelize.Op;

var smtpTransport = nodemailer.createTransport(config.mailer.options);
/**
 * Forgot for reset password (forgot POST)
 */
exports.forgot = function(req, res, next) {
  async.waterfall([

    // Generate random token
    function(done) {
      crypto.randomBytes(20, function(err, buffer) {
        var token = buffer.toString('hex');
        done(err, token);
      });
    },

    // Lookup user by username
    function(token, done) {
      if (req.body.email) {
        db.User
          .findOne({
            where: {
              email: req.body.email
            }
          })
          .then(function(user) {
              user.resetPasswordToken = token;
              user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

              user
                .save()
                .then(function() {
                  done(null, token, user);
                  return null;
                })
                .catch(function(err) {
                  return res.status(400).json(errorHandler.getErrorMessage(err));
                });

            return null;
          })
          .catch(function(err) {
            return res.status(400).json({
              data: {
                errors: 'No account with that email has been found'
              }
            });
          });
      } else {
        return res.status(400).json({
          data: {
            errors: 'Email field must not be blank'
          }
        });
      }
    },

    // Render path
    function(token, user, done) {
      res.render(path.resolve('src/app/users/templates/reset-password-email'), {
        name: user.name,
        appName: config.app.title,
        url: 'http://' + req.headers.host + '/api/auth/reset/' + token
      }, function(err, emailHTML) {
        done(err, emailHTML, user);
      });
    },

    // If valid email, send reset email using service
    function(emailHTML, user, done) {
      var mailOptions = {
        to: user.email,
        from: config.mailer.from,
        subject: 'Password Reset',
        html: emailHTML
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        if (!err) {
          res.json({
            data: {
              messages: 'An email has been sent to the provided email with further instructions.'
            }
          });
        } else {
          console.log('Mail Send Error:', err);
          return res.status(400).json(errorHandler.getErrorMessage(err));
        }

        done(err);
      });
    }
  ], function(err) {
    if (err) {
      return next(err);
    }
  });
};

/**
 * Reset password GET from email token
 */
exports.validateResetToken = function(req, res) {
  db.User
    .findOne({
      where: {
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
          [Op.gt]: moment().format()
        }
      }
    })
    .then(function(user) {
      if (!user) {
        return res.redirect('/#/auth/reset-password/invalid');
      }

      return res.redirect('/#/auth/reset-password/' + req.params.token);
      //return res.redirect('/#/auth/reset-password');
    })
    .catch(function(err) {
      return res.status(400).json(errorHandler.getErrorMessage(err));
    });
};

/**
 * Reset password Put from email token
 */
exports.reset = function(req, res, next) {
  // Init Variables
  var passwordDetails = req.body;
  async.waterfall([
    function(done) {
      var now = moment().toISOString();

      db.User
        .findOne({
          where: {
            resetPasswordToken: req.body.token,
            resetPasswordExpires: {
              [Op.gt]: moment().format()
            }
          }
        })
        .then(function(user) {
          if (user) {
            if (passwordDetails.password === passwordDetails.confirmPassword) {
              // user.password = passwordDetails.newPassword;
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
              activeDirectory.user(user.email).password(passwordDetails.password)
              .then(() => {
                return user.save()
              })
              .then(function() {
                done(null, user);
                return null;
              })
              .catch(function(err) {
                return res.status(400).json(errorHandler.getErrorMessage(err));
              });
            } else {
              return res.status(400).json({
                data: {
                  messages: 'Passwords do not match'
                }
              });
            }
          } else {
            return res.status(400).json({
              data: {
                errors: 'Password reset token is invalid or has expired.'
              }

            });
          }

          return null;
        })
        .catch(function(err) {
          return res.status(400).json(errorHandler.getErrorMessage(err));
        });
    },

    // Render
    function(user, done) {
      res.render('src/app/users/templates/reset-password-confirm-email', {
        name: user.name,
        appName: config.app.title
      }, function(err, emailHTML) {
        done(err, emailHTML, user);
      });
    },

    // If valid email, send reset email using service
    function(emailHTML, user, done) {
      var mailOptions = {
        to: user.email,
        from: config.mailer.from,
        subject: 'Your password has been changed',
        html: emailHTML
      };

      smtpTransport.sendMail(mailOptions, function(err) {
        if (!err) {
          res.json({
            data: {
              messages: 'Password reset email has been sent to the provided email'
            }
          });
        } else {
          console.log('Mail Send Error:', err);
          return res.status(200).json({
            data: {
              messages: 'Password has been reset Successfully. There was a failure in sending email.'
            }
          });
        }
        done(err);
      });
    }
  ], function(err) {
    if (err) {
      return next(err);
    }
  });
};

/**
 * Change Password
 */
exports.changePassword = function(req, res, next) {
  // Init Variables
  var passwordDetails = req.body,
    message = null;

  if (req.user) {
    if (passwordDetails.newPassword) {

      db.User
        .findOne({
          where: {
            id: req.user.dataValues.id
          }
        })
        .then(function(user) {

          if (user) {
            if (user.authenticate(user, passwordDetails.currentPassword)) {
              if (passwordDetails.newPassword === passwordDetails.verifyPassword) {

                user.password = passwordDetails.newPassword;

                user
                  .update({
                    password: user.password,
                    salt: null
                  })
                  .then(function() {
                    req.login(user, function(err) {
                      if (err) {
                        return res.status(400).json(err);
                      } else {
                        return res.json({
                          data: {
                            messages: 'Password changed successfully'
                          }
                        });
                      }
                    });

                    return null;
                  })
                  .catch(function(err) {
                    return res.status(400).json(errorHandler.getErrorMessage(err));
                  });
              } else {
                res.status(400).json({
                  data: {
                    errors: 'Passwords do not match'
                  }
                });
              }
            } else {
              res.status(400).json({
                data: {
                  errors: 'Current password is incorrect'
                }
              });
            }
          } else {
            res.status(400).json({
              data: {
                errors: 'User is not found'
              }
            });
          }

          return null;
        })
        .catch(function(err) {
          return next(err);
        });

    } else {
      res.status(400).json({
        data: {
          errors: 'Please provide a new password'
        }
      });
    }
  } else {
    res.status(400).json({
      data: {
        errors: 'User is not signed in'
      }
    });
  }
};
