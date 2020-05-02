const userRouter = require('express').Router();
const userController = require('./userController');

// ORDER IS IMPORTANT (or pain)
userRouter.use('/invite/:chatId', userController.welcomeFriend);
userRouter.use('/', userController.getUsers); // TODO: /all, app should work fine

module.exports = userRouter;
