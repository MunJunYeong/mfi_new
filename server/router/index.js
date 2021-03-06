const express = require('express')
const basicRouter = express.Router();
const {middleware} = require('../lib/common/index');
const anonymousRouter = require('./anonymous');
const userRouter = require('./user');
const ideaRouter = require('./idea');
const commentRouter = require('./comment');
const statisticsRouter = require('./statistics');

basicRouter.use('/', anonymousRouter);
basicRouter.use('/statistics', statisticsRouter);
basicRouter.use('/refresh', middleware.refreshToken);
basicRouter.use('/user', middleware.validateToken, userRouter)
basicRouter.use('/idea', middleware.validateToken, ideaRouter);
basicRouter.use('/comment', middleware.validateToken, commentRouter);

module.exports = {
    basicRouter
}