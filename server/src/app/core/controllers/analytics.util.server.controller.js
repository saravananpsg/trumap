'use strict';
var path = require('path'),
config = require(path.resolve('./src/config/config')),
request = require('request-promise-native'),
coreUtil = require(path.resolve('./src/app/core/controllers/util.server.controller'));

const analyticsConfig = config.analytics;
const sessionInitUrl = ( analyticsConfig && analyticsConfig.api.baseUrl) ?
  `${analyticsConfig.api.baseUrl}${analyticsConfig.api.sessionInitUrl}` : null;

const listingsUrl = ( analyticsConfig && analyticsConfig.api.baseUrl) ?
  `${analyticsConfig.api.baseUrl}${analyticsConfig.api.listingsUrl}` : null;

const chatUrl = ( analyticsConfig && analyticsConfig.api.baseUrl) ?
  `${analyticsConfig.api.baseUrl}${analyticsConfig.api.chatUrl}` : null;
function sendMessageToAnalytics(url, message) {
  const options = {
    url: url,
    method: 'POST',
    json: message
  };
  request(options)
  .catch((err) => {
    console.log('AnalyticsServer:Error:', err);
  })
}

exports.publishSessionInit = function(req) {
  if (!sessionInitUrl) return;
  const sessionId = coreUtil.extractSessionId(req);
  const sessionMessage = {
    sessionId: sessionId
  };
  sendMessageToAnalytics(sessionInitUrl, sessionMessage);
};

exports.publishListingsMessage = function(message) {
  if (!listingsUrl) return;
  sendMessageToAnalytics(listingsUrl, message);
}

exports.publishChatMessage = function(message) {
  if (!chatUrl) return;
  sendMessageToAnalytics(chatUrl, message);
}
