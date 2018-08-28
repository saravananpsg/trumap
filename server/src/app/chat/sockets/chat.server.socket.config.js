'use strict';
const roomName = 'filter';
let chatController = require('../controllers/chat.server.socket.controller');

// Create the chat configuration
module.exports = function (io, socket) {
  const sessionId = socket.request.session.unsignedSessionId || socket.id;
  // Emit the status event when a new socket client is connected
  // const roomId = `${roomName}-${sessionId}`;
  const roomId = `${roomName}-${socket.id}`;
  console.log('Room Id:', roomId);

  const newMessages = chatController.parseMessage('', 'connect');
  newMessages.forEach((newMessage) => {
    io.emit(roomId, newMessage);
  });
  // io.emit(roomId, newMessage);

  // newMessage = chatController.getSalutationConversation();

  // io.emit(roomId, newMessage);

  // newMessage = chatController.getStartConversation();

  // io.emit(roomId, newMessage);



  // Send a chat messages to all connected sockets when a message is received
  socket.on(roomId, function (message) {
    if(!message || !message.data) return;
    message.remoteAddress = socket.request.connection.remoteAddress;
    message.sessionId = socket.request.session.sessionId;
    const newMessages = chatController.parseMessage(message, message.type);
    newMessages.forEach((newMessage) => {
      io.emit(roomId, newMessage);
    });

  });

  // Emit the status event when a socket client is disconnected
  socket.on('disconnect', function () {
    console.log('DISCONNECT:', roomId);
    const newMessages = chatController.parseMessage('', 'disconnect');
    newMessages.forEach((newMessage) => {
      io.emit(roomId, newMessage);
    });
  });
};
