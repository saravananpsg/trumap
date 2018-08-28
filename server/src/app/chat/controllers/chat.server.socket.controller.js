'use strict';
var path = require('path'),
db = require(path.resolve('./src/config/lib/sequelize'));

const adminUserName = 'TruExpert';

function getStartConversation() {
  return parseStartConversation();
};

function getSalutationConversation() {
  const newMessage = {
    type: 'message',
    timestamp: Date.now(),
    username: adminUserName,
    data: {
      type: 'basic',
      text: 'Hello',
    }
  };
  return [newMessage];
};

function connectParser(message) {
  const newMessage = {
    type: 'status',
    text: 'Is now connected',
    timestamp: Date.now(),
    username: adminUserName
    // profileImageURL: socket.request.user.profileImageURL,
    // username: socket.request.user.username
  };

  return [newMessage];
}

function disconnectParser(message) {
  const newMessage = {
    type: 'status',
    text: 'disconnected',
    timestamp: Date.now(),
    //username: socket.request.user.username
    username: adminUserName
  };

  return [newMessage];
}


function parseStartConversation(message) {
  const newMessage = {
    type: 'message',
    timestamp: Date.now(),
    username: adminUserName,
    data: {
      type: 'presets',
      text: 'Are you looking to buy or rent a property?',
      actions: [{ name: 'Buy' }, { name: 'Rent' }]
    }
  };
  return [newMessage];
}

function parseBuyConversation(message) {
  const newMessage = {
    type: 'message',
    timestamp: Date.now(),
    username: adminUserName,
    data: {
      type: 'presets',
      text: 'I\'m still being trained to help you with that :)',
      actions: [{ name: 'All right, let\'s look at rentals' }]
    }
  };
  return [newMessage];
}

function parseRentConversation(message) {
  const newMessage = {
    type: 'message',
    timestamp: Date.now(),
    username: adminUserName,
    data: {
      type: 'presets',
      text: 'Great'
    }
  };
  return [newMessage];
}

function parseDefaultConversation(message) {
  return parseStartConversation(message);
}

const conversationParser = {
  start: parseStartConversation,
  buy: parseBuyConversation,
  rent: parseRentConversation,
  default: parseDefaultConversation
};

function getConversationTypeForMessage(message) {
  const data = message.data.text;
  if (data.match(/(hi|hello|hell|hey)/gi)) {
    return 'start';
  }

  if (data.match(/(buy|Buy)/gi)) {
    return 'buy';
  }

  if (data.match(/(rent|rental)/gi)) {
    return 'rent';
  }

  return 'default';
}

function chatParser(message) {
  db.Conversation.create(({
    ipaddress: message.remoteAddress,
    sessionId: message.sessionId,
    message: message
  }))
  .catch((err) => {
    console.log('Conversation Insert Error:', err);
  });
  /*db.Conversation.update({
    ipaddress: '1.2.3.4',
    // messages: message
    //messages: db.Sequelize.literal(`messages ||
    //   '[${JSON.stringify(message)}]'::jsonb`)
    messages: db.Sequelize.literal(`(Case
      WHEN messages IS NULL then '[]'::JSONB
      ELSE messages
      END
    ) || '[${JSON.stringify(message)}]'::JSONB
    `)
    // messages: [JSON.stringify(message)]
  }, { where: {sessionId: '456789'}}).then((created) => {
    console.log('Conversations Status:', created);
  })
  .catch((err) => {
    console.log('Conversations ERROR:', err);
  });
  */

  const conversationType = getConversationTypeForMessage(message);

  const newMessages = conversationParser[conversationType](message);

  return newMessages;
}

function controlParser(message) {

  let newMessages = [];
  switch(message.data.command) {
    case 'startConversation':
      newMessages = newMessages.concat(getSalutationConversation());
      newMessages = newMessages.concat(getStartConversation());
    break;
    default:
    break
  }
  return newMessages;
}

const messageParser = {
  connect: connectParser,
  message: chatParser,
  control: controlParser,
  disconnect: disconnectParser
};



exports.parseMessage = function(message, type) {
  //console.log('Message received:', message);
  const newMessages = messageParser[type](message);
  //console.log('ChatResponse:', newMessage);
  // Emit the 'chatMessage' event
  return newMessages;
};
