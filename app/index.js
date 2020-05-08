import "regenerator-runtime/runtime.js";
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import socket from 'socket.io';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';

import events from './events';

import userRouter from './components/User/userRouter';
import User from './components/User/User';

import chatRouter from './components/Chat/chatRouter';
import Chat from './components/Chat/Chat';

import messageRouter from './components/Message/messageRouter';
import Message from './components/Message/Message';

dotenv.config();
const port = process.env.PORT || 8080;
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

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, '..', 'client/dist')));
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client/dist', 'index.html'));
  });
}

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
  socket.on(events.ADD_USER_FROM_CLIENT, (userInfo) => {
    // Unzip user info
    const { hasInvite, name } = userInfo;
    // Check user type
    if (!hasInvite) {
      // Create a new user without an invitation
      currentUser = new User(socket.id, name, 'direct');
      // Save new user and log
      currentUser.save();
      // Response to client - 200 ok buddy
      socket.emit(events.ADD_USER_FROM_SERVER, currentUser);
      console.log('Create new user: ', currentUser); // CONSOLE (x)
    } else {
      // Has invite - create a new user with invite
      currentUser = new User(socket.id, name, 'invite');
      // Save new user and log
      currentUser.save();
      // Response to client - 200 ok buddy
      socket.emit(events.ADD_USER_FROM_SERVER, currentUser);
      console.log('Add new friend: ', currentUser); // CONSOLE (x)
    }
  });

  // CHAT-controls
  let defaultChat;
  socket.on(events.ADD_USER_FROM_CLIENT, async ({ hasInvite, chatId }) => {
    // Check user type
    if (!hasInvite) {
      // Create a new default chat
      defaultChat = new Chat('iChat', currentUser.getUserID());
      // Save a new chat
      defaultChat.saveChat();
      // Response to client - 200 ok buddy
      socket.emit(events.ADD_CHAT_FROM_SERVER, defaultChat);
      // log
      console.log('Create new chat: ', defaultChat); // CONSOLE (x)
    } else {
      // User is invited, get the right chat
      const allChats = await Chat.getAllChats();
      const [targetChat] = allChats.filter((chat) => chat.id === chatId);
      // Append current user as a member
      targetChat.memberIDs.push(currentUser.getUserID());
      // Update chats
      const newChats = Array.from(new Set([...allChats, targetChat]));
      await Chat.updateChats(newChats);
      // Response to client - 200 ok buddy
      io.sockets.emit(events.ADD_FRIEND_FROM_SERVER, targetChat);
      // log
      console.log('New invite: ', targetChat); // CONSOLE (x)
    }
  });

  socket.on(events.ADD_CHAT_FROM_CLIENT, (chatName) => {
    const currentUserID = currentUser.getUserID();
    const newChat = new Chat(chatName, currentUserID);
    newChat.saveChat();

    socket.emit(events.ADD_CHAT_FROM_SERVER, newChat);
    console.log(`New chat was cteated by user: ${newChat}`);
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
    console.log('User remove chat. Removing messages... Removed: ', messages.length - restMessages.length, chatId);
  });

  // Video call
  socket.on('callUser', (data) => {
    console.log(`Emit to ${data.userToCall} incoming call`);
    io.to(data.userToCall).emit('incoming', { signal: data.signalData, from: data.from });
  });

  // RESET stores
  socket.on('disconnect', async () => {
    // Remove all track where the current user is host
    await removeUserMarks(currentUser.getUserID());
    // Remove user when socket is dead
    currentUser.remove();
    // Send event to client, user leave
    socket.broadcast.emit(events.USER_LEAVE_FROM_SERVER, currentUser);
    console.log('User disconnected', currentUser); // CONSOLE (x)
  });
});

// Tools (?)
const removeUserMarks = async (userID) => {
  // Remove current user chats and membership
  const chats = await Chat.getAllChats();
  const restChats = chats.filter((chat) => chat.hostUserID !== userID);
  const chatsWithoutCurrentUserAsMember = restChats.map((chat) => {
    const { memberIDs } = chat;
    if (memberIDs.includes(userID)) {
      const cleanedMembers = memberIDs.filter((id) => id !== userID);
      chat.memberIDs = cleanedMembers;

      return chat;
    }

    return chat;
  })
  Chat.updateChats(chatsWithoutCurrentUserAsMember);

  // Remove current user messages
  const messages = await Message.getAllMessages();
  const restMessages = messages.filter((message) => message.authorId !== userID);
  Message.updateMessages(restMessages);
};
