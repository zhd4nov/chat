const chatRouter = require('express').Router();
const chatController = require('./chatController');

// ORDER IS IMPORTANT (or pain)
chatRouter.use('/byid/:chatid', chatController.getChatById);
chatRouter.use('/:userid', chatController.getUserChats);
chatRouter.use('/new', chatController.addNewChat);
chatRouter.use('/', chatController.getChats);

module.exports = chatRouter;
