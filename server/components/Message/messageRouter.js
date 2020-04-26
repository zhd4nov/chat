const messageRouter = require('express').Router();
const messageController = require('./messageController');

// ORDER IS IMPORTANT (or pain)
messageRouter.use('/:chatid', messageController.getChatMessages);
messageRouter.use('/', messageController.getAllUsers);

module.exports = messageRouter;
