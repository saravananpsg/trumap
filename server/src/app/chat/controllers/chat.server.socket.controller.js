'use strict';

var chatUtil = require('./chat.server.util.controller');

const adminUserName = 'TruExpert';

// message types
const MSG_TYPE_STATUS = 'status';
const MSG_TYPE_MESSAGE = 'message';
const MSG_TYPE_CONTROL = 'control';

// message body types
const MSG_BODY_TYPE_BASIC = 'basic';
const MSG_BODY_TYPE_PRESETS = 'presets';

// VALUE

/*const VALUE_RENT_INT_STUDENTS = 'rent_int_su';
const VALUE_RENT_COUPLES = 'rent_cop';
const VALUE_RENT_PARENTS = 'rent_par';
const VALUE_RENT_FOREIGN_WORKERS = 'rent_foreign_work';
const VALUE_RENT_PRS = 'rent_prs';
const VALUE_FILTER_GO_AHEAD = 'filter_go';
const VALUE_FILTER_MAYBE = 'filter_maybe';
*/

// commands
const CMD_INACTIVE_FIRST_TIME = 'inActiveFirstTime';
const CMD_INACTIVE_SECOND_TIME = 'inActiveSecondTime';
const CMD_FAILED_ACTION = 'failedAction';
const CMD_START_CONVERSATION = 'startConversation';


// messages text

const MSG_AMENITIES = [
  { name: 'AED Locations', value: 'aed_locations'},
  { name: 'AXS Stations', value: 'axs_stations' },
  { name: 'Child Care', value: 'child_care' },
  { name: 'Community Clubs', value: 'community_clubs' },
  { name: 'Constituency Offices', value: 'constituency_offices' },
  { name: 'Disability Care', value: 'disability_care' },
  { name: 'Elder Care', value: 'elder_care' },
  { name: 'Hawker Centres', value: 'hawker_centres' },
  { name: 'Historic Sites', value: 'historic_sites' },
  { name: 'Hospitals', value: 'hospitals' },
  { name: 'Hotels', value: 'hotels' },
  { name: 'Kindergardens', value: 'kinder_gardens' },
  { name: 'Libraries', value: 'libraries' },
  { name: 'Money Exchangers', value: 'money_xchanger' },
  { name: 'Museums', value: 'museum' },
  { name: 'Nursing Homes', value: 'nursing_home' },
  { name: 'Pharmacies', value: 'pharmacy' },
  { name: 'Pre-Schools', value: 'preschools' },
  { name: 'Private Institutions', value: 'private_inst' },
  { name: 'Remittance', value: 'remittance' },
  { name: 'Schools', value: 'schools' },
  { name: 'Student Care', value: 'student_care' },
  { name: 'Supermarket', value: 'super_market' },
  { name: 'Train Stations', value: 'train_station_names' },
  { name: 'Voluntary Welfare', value: 'voluntary_welfare' },
];
/*const MSG_TEXT_RENTAL_INT_STUDENTS = 'Rentals for international students';
const MSG_TEXT_RENTAL_COUPLE = 'Rentals for couples';
const MSG_TEXT_RENTAL_PARENTS = 'Rentals for parents';
const MSG_TEXT_RENTAL_FOREIGN_WORKERS = 'Rentals for foreign workers';
const MSG_TEXT_RENTAL_FOR_PRS = 'Rentals for PRs';
const MSG_TEXT_MAP_FILTERS = 'This will update the map filters, are you sure you want to continue';
const MSG_TEXT_MAP_FILTERS_UPDATE = `I\'ve updated the map filters with nearby amenities which I feel
  are the most suitable for Rentals for international students`;
const MSG_TEXT_MAP_FILTERS_GO = 'Sure, go ahead';
const MSG_TEXT_MAP_FILTERS_MAYBE ='Maybe later';
*/
const MESSAGES = {
   MSG_TEXT_WELCOME: {
     text: 'Welcome to Trumap, and thank you for visiting our site.',
     value: 'welcome'
   },
   MSG_TEXT_WELCOME_QUERY: {
     text: `Currently, I am being trained to help expatriates,
     find a place to stay in Singapore. I was wondering, is this what you consider yourself?`,
     value: 'trained_expat'
   },
   MSG_TEXT_YES_EXPAT: { text: 'Yes', value: 'yes_expat' },
   MSG_TEXT_NO_EXPAT: { text: 'No - I am not an expat', value: 'no_expat'},
   MSG_TEXT_ACTIVATE_LAYER_YES: {
     text: `That's great, I may not know you, but I thought I would start
      by activating some of the map layers on the right.
      These layers are dynamic, and allow me to find places near some useful amenities
      for you`,
      value: 'yes_activate_layers'

   },
   MSG_TEXT_ACTIVATE_LAYER_NO: {
     text: `That's not a problem, I may not know you,
     but I would like to show you some of the map layers on your right.
     These layers are dynamic, and allow me to find places near some useful amenities
     for you`,
     value: 'no_activate_layers'
   },
   MSG_TEXT_OKAY_LAYERS: { text: 'Okay', value: 'ok_layers' },
   MSG_TEXT_QUESTIONS_SERIES: {
     text: `I will also be asking you a series of questions,
       to see if I can help you find your perfect home. I hope that's alright with you!
       If not, you can close this chat right now.`,
      value: 'question_series'
   },
   MSG_TEXT_OKAY_QUESTIONS: { text: 'Okay', value: 'ok_questions' },
   MSG_TEXT_AMENITIES: {
     text: `Do it matter to you to be near to :amenity`,
     value: 'show_amenities'
   },
   MSG_TEXT_AMENITIES_YES: {
     text: 'Yes',
     value: 'yes_amenities'
   },
   MSG_TEXT_AMENITIES_NO: {
     text: 'No',
     value: 'no_amenities'
   },
   MSG_TEXT_TO_BE_TRAINED: {
     text: 'I\'m still being trained to help you with that :)',
     value: 'to_be_trained'
   },
   MSG_TEXT_CONTACT: {
     text: `If you'd rather speak with an agent directly, you can reach us by
       email at team@truuue.com, or by phone at (+65) 6591 8842/ (+65) 8204 2356`,
     value: 'contact_agent'
   },
   MSG_TEXT_INACTIVE_FIRST_TIME: {
     text: `Hello! It looks like you've been inactive for a while. Can I help you
       with anything?`,
     value: CMD_INACTIVE_FIRST_TIME
   },
   MSG_TEXT_INACTIVE_SECOND_TIME: {
     text: 'Lost in thought? :) Can I help you with something?',
     value: CMD_INACTIVE_SECOND_TIME
   },

};

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function constructMessage(type) {
  const newMessage = {
    type: type,
    timestamp: Date.now(),
    username: adminUserName
  };


  return newMessage;
}

function constructDataMessage(type, dataType) {
  const newMessage = constructMessage(type);
  newMessage.data = {
    type: dataType
  }

  return newMessage
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


/*function getFilterConversation(message) {
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
*/

function getStartConversation() {

  const newMessage0 = constructDataMessage(MSG_TYPE_MESSAGE,  MSG_BODY_TYPE_BASIC);
  newMessage0.data = { ...newMessage0.data,  ...MESSAGES.MSG_TEXT_WELCOME };

  const newMessage1 = constructDataMessage(MSG_TYPE_MESSAGE, MSG_BODY_TYPE_PRESETS);
  newMessage1.data = { ...newMessage1.data, ...MESSAGES.MSG_TEXT_WELCOME_QUERY };
  newMessage1.data.actions = [ MESSAGES.MSG_TEXT_YES_EXPAT, MESSAGES.MSG_TEXT_NO_EXPAT];

  return [newMessage0, newMessage1];
};


function getDefaultConversation(message) {
  const newMessage = constructDataMessage(MSG_TYPE_MESSAGE, MSG_BODY_TYPE_BASIC);
  newMessage.data = { ...newMessage.data, ...MESSAGES.MSG_TEXT_TO_BE_TRAINED };
  return [newMessage];
}

function getExpatYesConversation(message) {
  let newMessage = constructDataMessage(MSG_TYPE_MESSAGE, MSG_BODY_TYPE_PRESETS);
  newMessage.data = { ...newMessage.data, ...MESSAGES.MSG_TEXT_ACTIVATE_LAYER_YES };
  newMessage.data.actions = [ MESSAGES.MSG_TEXT_OKAY_LAYERS ];

  return [newMessage];
}

function getExpatNoConversation(message) {
  let newMessage = constructDataMessage(MSG_TYPE_MESSAGE, MSG_BODY_TYPE_PRESETS);
  newMessage.data = { ...newMessage.data, ...MESSAGES.MSG_TEXT_ACTIVATE_LAYER_NO };
  newMessage.data.actions = [ MESSAGES.MSG_TEXT_OKAY_LAYERS ];

  return [newMessage];
}

function getExpatOkLayersConversation(message) {
  let newMessage = constructDataMessage(MSG_TYPE_MESSAGE, MSG_BODY_TYPE_PRESETS);
  newMessage.data = { ...newMessage.data, ...MESSAGES.MSG_TEXT_QUESTIONS_SERIES };
  newMessage.data.actions = [ MESSAGES.MSG_TEXT_OKAY_QUESTIONS ];

  return [newMessage];
}

function getExpatAmentiesConversation(message) {
  let newMessage = constructDataMessage(MSG_TYPE_MESSAGE, MSG_BODY_TYPE_PRESETS);

  newMessage.data = { ...newMessage.data, ...MESSAGES.MSG_TEXT_AMENITIES };
  let amenity = MSG_AMENITIES[getRandomInt(MSG_AMENITIES.length)];
  newMessage.data.text = newMessage.data.text.replace(':amenity', amenity.name);
  newMessage.data.amenity = amenity;
  newMessage.data.actions = [ MESSAGES.MSG_TEXT_AMENITIES_YES,
    MESSAGES.MSG_TEXT_AMENITIES_NO ];

  return [newMessage];
}

function getExpatOkQuestionsConversation(message) {
  return getExpatAmentiesConversation(message);
}

function getContactConversation(message) {
  const newMessage = constructDataMessage(MSG_TYPE_MESSAGE, MSG_BODY_TYPE_BASIC);
  newMessage.data = { ...newMessage.data, ...MESSAGES.MSG_TEXT_CONTACT };

  return [newMessage];
}

function getInActiveFirstTimeMessages() {
  const newMessage = constructDataMessage(MSG_TYPE_MESSAGE, MSG_BODY_TYPE_BASIC);
  newMessage.data = { ...newMessage.data, ...MESSAGES.MSG_TEXT_INACTIVE_FIRST_TIME };

  return [newMessage];
}

function getInActiveSecondTimeMessages() {
  const newMessage = constructDataMessage(MSG_TYPE_MESSAGE, MSG_BODY_TYPE_BASIC);
  newMessage.data = { ...newMessage.data, ...MESSAGES.MSG_TEXT_INACTIVE_SECOND_TIME };

  return [newMessage];
}

/*const conversationParser = {
  filter: getFilterConversation,
  'filter-confirm': getFilterConfirmConversation,
  contact: getContactConversation,
  default: getDefaultConversation
};

function getConversationTypeForMessage(message) {
  const data = message.data.value;
  let conversationType = 'default';
  switch (data) {
    case MESSAGES.MESSAGE
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

  return conversationType;
}*/

function getConversationParserForMessage(message) {
  const data = message.data.value;
  let conversationParser = getDefaultConversation;
  switch (data) {
    case MESSAGES.MSG_TEXT_YES_EXPAT.value:
      conversationParser = getExpatYesConversation;
      break;
    case MESSAGES.MSG_TEXT_NO_EXPAT.value:
      conversationParser = getExpatNoConversation;
      break;
    case MESSAGES.MSG_TEXT_OKAY_LAYERS.value:
      conversationParser = getExpatOkLayersConversation;
      break;
    case MESSAGES.MSG_TEXT_OKAY_QUESTIONS.value:
      conversationParser = getExpatOkQuestionsConversation;
      break;
    case MESSAGES.MSG_TEXT_AMENITIES_YES.value:
      conversationParser = getExpatAmentiesConversation;
      break;
    case MESSAGES.MSG_TEXT_AMENITIES_NO.value:
      conversationParser = getExpatAmentiesConversation;
      break;
    default:
      conversationParser = getDefaultConversation;
  }

  return conversationParser;
}

function chatParser(message) {
  // const conversationType = getConversationTypeForMessage(message);
  // const responseMessages = conversationParser[conversationType](message);
  const conversationParser =  getConversationParserForMessage(message);
  // console.log(conversationParser);
  const responseMessages = conversationParser(message);
  chatUtil.publishToExternalSources(message, responseMessages);
  return responseMessages;
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
