const express = require('express')
const userRouter = express.Router();
const {auth : userController} = require('../../controllers');


// userRouter.get('/', userPagination.findAll);
userRouter.get('/', userController.getUser);
userRouter.put('/',  userController.updateUserRole);




module.exports = userRouter;