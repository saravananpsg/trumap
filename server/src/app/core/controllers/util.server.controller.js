'use strict';
exports.extractIPAdress = function(request) {
  return request.headers['x-forwarded-for'] ||
    request.connection.remoteAddress || req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);
};

exports.extractSessionId = function(request) {
  return request.sessionID;
}
