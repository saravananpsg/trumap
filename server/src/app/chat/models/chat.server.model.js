'use strict';

module.exports = function(sequelize, DataTypes) {

  var Conversations = sequelize.define('Conversation', {
    ipaddress: {
      type: DataTypes.STRING,
    },
    sessionId: {
      type: DataTypes.STRING,
    },
    message: {
      // type: DataTypes.ARRAY(DataTypes.JSONB),
      //defaultValue: []
      type: DataTypes.JSONB
    }
    /*messages: {
      type: DataTypes.JSONB
    }*/
  }, {
    classMethods: {
    }
  });

  return Conversations;
};
