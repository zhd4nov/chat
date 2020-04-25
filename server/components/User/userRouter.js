const userRouter = require('express').Router();
const userController = require('./userController');

userRouter.use('/new', userController.createUser);

module.exports = userRouter;
