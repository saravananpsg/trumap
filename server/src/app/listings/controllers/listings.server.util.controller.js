var path = require('path'),
coreUtil = require(path.resolve('./src/app/core/controllers/util.server.controller')),
analyticsUtil = require(path.resolve('./src/app/core/controllers/analytics.util.server.controller'));





function constructMessage(req, filter, response, error) {
  const newMessage = {
    ipaddress: coreUtil.extractIPAdress(req),
    sessionId: coreUtil.extractSessionId(req),
    filter: filter
  };
  (response) ? newMessage.response = response : newMessage.error = error;

  return newMessage;
}


exports.publishToExternalSources = function(req, filter, response, error) {
  const newMessage = constructMessage(req, filter, response, error);
  analyticsUtil.publishListingsMessage(newMessage);
};
