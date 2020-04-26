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

    socket.emit(events.ADD_USER_FROM_SERVER, currentUser);
    console.log('Create new user: ', currentUser);
  });

  socket.on('disconnect', () => {
    currentUser.remove();
    console.log('user disconnected', currentUser);
  });
});
