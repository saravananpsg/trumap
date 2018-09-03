var path = require('path'),
db = require(path.resolve('./src/config/lib/sequelize')),
analyticsUtil = require(path.resolve('./src/app/core/controllers/analytics.util.server.controller'));

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
  newMessage.response = responseMessages[0];
  analyticsUtil.publishChatMessage(newMessage);
};
