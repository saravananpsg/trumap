'use strict';
var path = require('path'),
db = require(path.resolve('./src/config/lib/sequelize'));

const adminUserName = 'TruExpert';


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

function getStartConversation() {
  const newMessage = {
    type: 'message',
    timestamp: Date.now(),
    username: adminUserName,
    data: {
      type: 'basic',
      text: 'Hello!',
    }
  };
  const newMessage1 = {
    type: 'message',
    timestamp: Date.now(),
    username: adminUserName,
    data: {
      type: 'basic',
      text: 'Welcome to Trumap, and thank you for visiting our site.'
    }
  };
  const newMessage2 = {
    type: 'message',
    timestamp: Date.now(),
    username: adminUserName,
    data: {
      type: 'presets',
      text: 'What sort of rental listings would you like to look at?',
      actions: [{ name: 'Rentals for international students' },
        { name: 'Rentals for couples' },
        { name: 'Rentals for parents'},
        { name: 'Rentals for foreign workers'},
        { name: 'Rentals for PRs'}
      ]
    }
  };
  return [newMessage, newMessage1, newMessage2];
};


function getDefaultConversation(message) {
  const newMessage = {
    type: 'message',
    timestamp: Date.now(),
    username: adminUserName,
    data: {
      type: 'basic',
      text: 'I\'m still being trained to help you with that :)',
      value: 'to_be_trained'
    }
  };
  return [newMessage];
}

function getFilterConversation(message) {
  const newMessage = {
    type: 'message',
    timestamp: Date.now(),
    username: adminUserName,
    data: {
      type: 'presets',
      text: 'This will update the map filters, are you sure you want to continue',
      actions: [{ name: 'Sure, go ahead' },
        { name: 'Maybe later' },
      ]
    }
  }
  return [newMessage];
}

function getFilterConfirmConversation(message) {
  const newMessage = {
    type: 'message',
    timestamp: Date.now(),
    username: adminUserName,
    data: {
      type: 'basic',
      text: `I\'ve updated the map filters with nearby amenities which I feel
        are the most suitable for Rentals for international students`,
    }
  }
  return [newMessage];
}

function getContactConversation(message) {
  const newMessage = {
    type: 'message',
    timestamp: Date.now(),
    username: adminUserName,
    data: {
      type: 'basic',
      text: `If you'd rather speak with an agent directly, you can reach us by
        email at team@truuue.com, or by phone at (+65) 6591 8842/ (+65) 8204 2356 `,
    }
  }
  return [newMessage];
}

const conversationParser = {
  filter: getFilterConversation,
  'filter-confirm': getFilterConfirmConversation,
  contact: getContactConversation,
  default: getDefaultConversation
};

function getConversationTypeForMessage(message) {
  const data = message.data.text;
  let conversationType = 'default';
  switch (data) {
    case 'Rentals for international students':
      conversationType = 'filter';
      break;
    case 'Sure, go ahead':
      conversationType = 'filter-confirm';
      break;
    case 'Maybe later':
      conversationType = 'contact';
      break;
    default:
      conversationType = 'default';
  }
  /*if (data.match(/(hi|hello|hell|hey)/gi)) {
    return 'default';
  }

  if (data.match(/(buy|Buy)/gi)) {
    return 'buy';
  }

  if (data.match(/(rent|rental)/gi)) {
    return 'rent';
  }*/

  return conversationType;
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
      newMessages = getStartConversation();
      break;
    case 'failedAction':
    newMessages = getContactConversation();
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
