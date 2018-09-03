var path = require('path'),
db = require(path.resolve('./src/config/lib/sequelize')),
config = require(path.resolve('./src/config/config')),
request = require('request-promise-native');

const analyticsConfig = config.analytics;
const analyticsApiUrl = ( analyticsConfig && analyticsConfig.api.baseUrl) ?
  `${analyticsConfig.api.baseUrl}${analyticsConfig.api.chatUrl}` : null;


function constructMessage(message) {
  const newMessage = {
    ipaddress: message.remoteAddress,
    sessionId: message.sessionId,
    message: message
  };

  return newMessage;
}

function publishToDB(message) {
  db.Conversation.create(message)
  .catch((err) => {
    console.log('Conversation Insert Error:', err);
  });
}

function publishToAnalyticsServer(message, responseMessages) {
  if (!analyticsApiUrl) return;
  message.response = responseMessages[0];
  const options = {
    url: analyticsApiUrl,
    method: 'POST',
    json: message
  };
  request(options)
  .catch((err) => {
    console.log('AnalyticsServer:Error:', err);
  })
}

exports.publishToExternalSources = function(message, responseMessages) {
  const newMessage = constructMessage(message);
  publishToDB(newMessage);
  publishToAnalyticsServer(newMessage, responseMessages);
};
