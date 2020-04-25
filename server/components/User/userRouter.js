const userRouter = require('express').Router();
const userController = require('./userController');

// ORDER IS IMPORTANT (or pain)
userRouter.use('/', userController.getUsers);

module.exports = userRouter;
