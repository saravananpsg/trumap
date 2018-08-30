'use strict';
var path = require('path'),
db = require(path.resolve('./src/config/lib/sequelize'));

const adminUserName = 'TruExpert';

// message types
const MSG_TYPE_STATUS = 'status';
const MSG_TYPE_MESSAGE = 'message';
const MSG_TYPE_CONTROL = 'control';

// message body types
const MSG_BODY_TYPE_BASIC = 'basic';
const MSG_BODY_TYPE_PRESETS = 'presets';

// VALUE
const VALUE_RENT_INT_STUDENTS = 'rent_int_su';
const VALUE_RENT_COUPLES = 'rent_cop';
const VALUE_RENT_PARENTS = 'rent_par';
const VALUE_RENT_FOREIGN_WORKERS = 'rent_foreign_work';
const VALUE_RENT_PRS = 'rent_prs';
const VALUE_FILTER_GO_AHEAD = 'filter_go';
const VALUE_FILTER_MAYBE = 'filter_maybe';
const VALUE_TO_BE_TRAINED = 'to_be_trained';
// commands
const CMD_INACTIVE_FIRST_TIME = 'inActiveFirstTime';
const CMD_INACTIVE_SECOND_TIME = 'inActiveSecondTime';
const CMD_FAILED_ACTION = 'failedAction';
const CMD_START_CONVERSATION = 'startConversation';

// messages text
const MSG_TEXT_HELLO = 'Hello!';
const MSG_TEXT_WELCOME = 'Welcome to Trumap, and thank you for visiting our site.';
const MSG_TEXT_WELCOME_QUERY = 'What sort of rental listings would you like to look at?';
const MSG_TEXT_RENTAL_INT_STUDENTS = 'Rentals for international students';
const MSG_TEXT_RENTAL_COUPLE = 'Rentals for couples';
const MSG_TEXT_RENTAL_PARENTS = 'Rentals for parents';
const MSG_TEXT_RENTAL_FOREIGN_WORKERS = 'Rentals for foreign workers';
const MSG_TEXT_RENTAL_FOR_PRS = 'Rentals for PRs';
const MSG_TEXT_TO_BE_TRAINED = 'I\'m still being trained to help you with that :)';
const MSG_TEXT_MAP_FILTERS = 'This will update the map filters, are you sure you want to continue';
const MSG_TEXT_MAP_FILTERS_UPDATE = `I\'ve updated the map filters with nearby amenities which I feel
  are the most suitable for Rentals for international students`;
const MSG_TEXT_CONTACT = `If you'd rather speak with an agent directly, you can reach us by
  email at team@truuue.com, or by phone at (+65) 6591 8842/ (+65) 8204 2356`;
const MSG_TEXT_INACTIVE_FIRST_TIME = `Hello! It looks like you've been inactive for a while. Can I help you
  with anything?`;
const MSG_TEXT_INACTIVE_SECOND_TIME = `Lost in thought? :) Can I help you with something?`;
const MSG_TEXT_MAP_FILTERS_GO = 'Sure, go ahead';
const MSG_TEXT_MAP_FILTERS_MAYBE ='Maybe later';

function constructMessage(type) {
  const newMessage = {
    type: type,
    timestamp: Date.now(),
    username: adminUserName
  };

  return newMessage;
}

function connectParser(message) {
  const newMessage = constructMessage(MSG_TYPE_STATUS);
  newMessage.text = 'Is now connected';
  return [newMessage];
}

function disconnectParser(message) {
  const newMessage = constructMessage(MSG_TYPE_STATUS);
  newMessage.text = 'disconnnected';

  return [newMessage];
}

function getStartConversation() {
  const newMessage = constructMessage(MSG_TYPE_MESSAGE);
  newMessage.data = {
    type: MSG_BODY_TYPE_BASIC,
    text: MSG_TEXT_HELLO,
  }

  const newMessage1 = constructMessage(MSG_TYPE_MESSAGE);
  newMessage1.data = {
    type: MSG_BODY_TYPE_BASIC,
    text: MSG_TEXT_WELCOME
  }

  const newMessage2 = constructMessage(MSG_TYPE_MESSAGE);
  newMessage2.data = {
    type: MSG_BODY_TYPE_PRESETS,
    text: MSG_TEXT_WELCOME_QUERY,
    actions: [{ name: MSG_TEXT_RENTAL_INT_STUDENTS, value: VALUE_RENT_INT_STUDENTS },
      { name: MSG_TEXT_RENTAL_COUPLE, value: VALUE_RENT_COUPLES },
      { name: MSG_TEXT_RENTAL_PARENTS, value: VALUE_RENT_PARENTS },
      { name: MSG_TEXT_RENTAL_FOREIGN_WORKERS, value: VALUE_RENT_FOREIGN_WORKERS },
      { name: MSG_TEXT_RENTAL_FOR_PRS, value: VALUE_RENT_PRS }
    ]
  };

  return [newMessage, newMessage1, newMessage2];
};


function getDefaultConversation(message) {
  const newMessage = constructMessage(MSG_TYPE_MESSAGE);
  newMessage.data = {
    type: MSG_BODY_TYPE_BASIC,
    text: MSG_TEXT_TO_BE_TRAINED,
    value: VALUE_TO_BE_TRAINED
  };

  return [newMessage];
}

function getFilterConversation(message) {
  const newMessage = constructMessage(MSG_TYPE_MESSAGE);
  newMessage.data = {
    type: MSG_BODY_TYPE_PRESETS,
    text: MSG_TEXT_MAP_FILTERS,
    actions: [{ name: MSG_TEXT_MAP_FILTERS_GO, value: VALUE_FILTER_GO_AHEAD },
      { name: MSG_TEXT_MAP_FILTERS_MAYBE, value: VALUE_FILTER_MAYBE },
    ]
  };

  return [newMessage];
}

function getFilterConfirmConversation(message) {
  const newMessage = constructMessage(MSG_TYPE_MESSAGE);
  newMessage.data = {
    type: MSG_BODY_TYPE_BASIC,
    text: MSG_TEXT_MAP_FILTERS_UPDATE,
  };

  return [newMessage];
}

function getContactConversation(message) {
  const newMessage = constructMessage(MSG_TYPE_MESSAGE);
  newMessage.data = {
    type: MSG_BODY_TYPE_BASIC,
    text: MSG_TEXT_CONTACT,
  };

  return [newMessage];
}

function getInActiveFirstTimeMessages() {
  const newMessage = constructMessage(MSG_TYPE_MESSAGE);
  newMessage.data = {
    type: MSG_BODY_TYPE_BASIC,
    text: MSG_TEXT_INACTIVE_FIRST_TIME,
    value: CMD_INACTIVE_FIRST_TIME
  };

  return [newMessage];
}

function getInActiveSecondTimeMessages() {
  const newMessage = constructMessage(MSG_TYPE_MESSAGE);
  newMessage.data = {
    type: MSG_BODY_TYPE_BASIC,
    text: MSG_TEXT_INACTIVE_SECOND_TIME,
    value: CMD_INACTIVE_SECOND_TIME
  };

  return [newMessage];
}

const conversationParser = {
  filter: getFilterConversation,
  'filter-confirm': getFilterConfirmConversation,
  contact: getContactConversation,
  default: getDefaultConversation
};

function getConversationTypeForMessage(message) {
  const data = message.data.value;
  let conversationType = 'default';
  switch (data) {
    case VALUE_RENT_INT_STUDENTS:
      conversationType = 'filter';
      break;
    case VALUE_FILTER_GO_AHEAD:
      conversationType = 'filter-confirm';
      break;
    case VALUE_FILTER_MAYBE:
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

  const conversationType = getConversationTypeForMessage(message);

  const newMessages = conversationParser[conversationType](message);

  return newMessages;
}

function controlParser(message) {
  let newMessages = [];
  switch(message.data.command) {
    case CMD_START_CONVERSATION:
      newMessages = getStartConversation();
      break;
    case CMD_FAILED_ACTION:
      newMessages = getContactConversation();
      break;
    case CMD_INACTIVE_FIRST_TIME:
      newMessages = getInActiveFirstTimeMessages();
      break;
    case CMD_INACTIVE_SECOND_TIME:
      newMessages = getInActiveSecondTimeMessages();
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
