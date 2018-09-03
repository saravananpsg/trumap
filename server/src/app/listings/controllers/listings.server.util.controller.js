var path = require('path'),
db = require(path.resolve('./src/config/lib/sequelize')),
config = require(path.resolve('./src/config/config')),
request = require('request-promise-native'),
coreUtil = require(path.resolve('./src/app/core/controllers/util.server.controller'));

const analyticsConfig = config.analytics;
const analyticsApiUrl = ( analyticsConfig && analyticsConfig.api.baseUrl) ?
  `${analyticsConfig.api.baseUrl}${analyticsConfig.api.listingsUrl}` : null;




function constructMessage(req, filter, response, error) {
  const newMessage = {
    ipaddress: coreUtil.extractIPAdress(req),
    sessionId: coreUtil.extractSessionId(req),
    filter: filter
  };
  (response) ? newMessage.response = response : newMessage.error = error;

  return newMessage;
}

function publishToAnalyticsServer(newMessage) {
  if (!analyticsApiUrl) return;


  const options = {
    url: analyticsApiUrl,
    method: 'POST',
    json: newMessage
  };
  request(options)
  .catch((err) => {
    console.log('AnalyticsServer:Error:', err);
  })
}

exports.publishToExternalSources = function(req, filter, response, error) {
  const newMessage = constructMessage(req, filter, response, error);
  publishToAnalyticsServer(newMessage);
};
