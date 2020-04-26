import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import socket from 'socket.io';
import path from 'path';
import morgan from 'morgan';
import cookieParser from 'cookie-parser'

import events from './events';
// import { readFile, updateFile } from './helpers/fs';

import userRouter from './components/User/userRouter';
import User from './components/User/User';
import chatRouter from './components/Chat/chatRouter';
import Chat from './components/Chat/Chat';

dotenv.config();
const port = process.env.SOCKET_PORT || 5000;
const app = express();
const logger = morgan('dev');

app
  .use(cors())
  .use(logger)
  .use(cookieParser());

app.use('/users', userRouter);
app.use('/chats', chatRouter);

const server = app.listen(port, () => {
  console.log(`Server up and running on port ${port}`)
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('user connected', socket.id);
  let currentUser;
  socket.on(events.ADD_USER_FROM_CLIENT, (name) => {
    currentUser = new User(socket.id, name);
    currentUser.save();
    console.log('Create new user: ', currentUser);

    socket.emit(events.ADD_USER_FROM_SERVER, currentUser);
  });

  let defaultChat;
  socket.on(events.ADD_USER_FROM_CLIENT, () => {
    if (currentUser.getUserType() === 'direct') {
      defaultChat = new Chat('iChat', currentUser.getUserID());
      defaultChat.saveChat();
      console.log('Create new chat: ', defaultChat);
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

  socket.on('disconnect', async () => {
    // Remove all track where the current user is host
    await removeUserChats(currentUser.getUserID());
    currentUser.remove();
    console.log('user disconnected', currentUser);
  });
});

const removeUserChats = async (userID) => {
  const chats = await Chat.getAllChats();
  const restChats = chats.filter((chat) => chat.hostUserID !== userID);
  Chat.updateChats(restChats);
};
