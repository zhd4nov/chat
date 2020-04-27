import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import socket from 'socket.io';
import morgan from 'morgan';
import cookieParser from 'cookie-parser'

import events from './events';

import userRouter from './components/User/userRouter';
import User from './components/User/User';

import chatRouter from './components/Chat/chatRouter';
import Chat from './components/Chat/Chat';

import messageRouter from './components/Message/messageRouter';
import Message from './components/Message/Message';

dotenv.config();
const port = process.env.SOCKET_PORT || 5000;
const app = express();
const logger = morgan('dev');

app
  .use(cors())
  .use(logger)
  .use(cookieParser());

// Routes
app.use('/users', userRouter);
app.use('/chats', chatRouter);
app.use('/messages', messageRouter);


// run server
const server = app.listen(port, () => {
  console.log(`Server up and running on port ${port}`)
});
// init socket
const io = socket(server);

// Working with socket
// TODO: REFACTOR ME PLEASE
io.on('connection', (socket) => {
  console.log('user connected', socket.id); // CONSOLE (x)
  // USER-controlls
  let currentUser;
  socket.on(events.ADD_USER_FROM_CLIENT, (name) => {
    currentUser = new User(socket.id, name);
    currentUser.save();
    console.log('Create new user: ', currentUser); // CONSOLE (x)

    socket.emit(events.ADD_USER_FROM_SERVER, currentUser);
  });

  // CHAT-controls
  let defaultChat;
  socket.on(events.ADD_USER_FROM_CLIENT, () => {
    if (currentUser.getUserType() === 'direct') {
      defaultChat = new Chat('iChat', currentUser.getUserID());
      defaultChat.saveChat();
      console.log('Create new chat: ', defaultChat); // CONSOLE (x)
    }
    socket.emit(events.ADD_CHAT_FROM_SERVER, defaultChat);
  });

  socket.on(events.ADD_CHAT_FROM_CLIENT, (chatName) => {
    const currentUserID = currentUser.getUserID();
    const newChat = new Chat(chatName, currentUserID);
    newChat.saveChat();

    socket.emit(events.ADD_CHAT_FROM_SERVER, newChat);
  });

  socket.on(events.DELETE_CHAT_FROM_CLIENT, async (chatID) => {
    const chats = await Chat.getAllChats();
    const newChats = chats.filter((chat) => chat.id !== chatID);
    await Chat.updateChats(newChats);
    socket.emit(events.DELETE_CHAT_FROM_SERVER, null);
  });

  // MESSAGE-controls
  socket.on(events.ADD_MESSAGE_FROM_CLIENT, ({ newMessage, chatId }) => {
    //Create a new message
    const message = new Message(
      currentUser.getUserID(),
      currentUser.getUserName(),
      chatId,
      newMessage,
    );
    // Write message to file messages.json
    message.saveMessage();
    // Send messages event to ALL sockets
    io.sockets.emit(events.ADD_MESSAGE_FROM_SERVER, null);
    console.log('We have a new message: ', message);
  });

  socket.on(events.DELETE_CHAT_FROM_CLIENT, async (chatId) => {
    // Remove all messages belong to a deleted chat
    const messages = await Message.getAllMessages();
    const restMessages = messages.filter((message) => message.chatId !== chatId);
    await Message.updateMessages(restMessages);
    console.log('cleaning is finished. Remove: ', messages.length - restMessages.length);
  });

  // RESET stores
  socket.on('disconnect', async () => {
    // Remove all track where the current user is host
    await removeUserChats(currentUser.getUserID());
    // Remove user when socket is dead
    currentUser.remove();
    console.log('user disconnected', currentUser); // CONSOLE (x)
  });
});

// Tools (?)
const removeUserChats = async (userID) => {
  const chats = await Chat.getAllChats();
  const restChats = chats.filter((chat) => chat.hostUserID !== userID);

  Chat.updateChats(restChats);
};
