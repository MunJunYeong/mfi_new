const express = require('express')
const basicRouter = express.Router();
const {middleware} = require('../lib/common/index');
const anonymousRouter = require('./anonymous');
const userRouter = require('./user');
const ideaRouter = require('./idea');
const commentRouter = require('./comment');

basicRouter.use('/', anonymousRouter);
basicRouter.use('/token', middleware.validateToken);
basicRouter.use('/user', middleware.validateToken, userRouter)
basicRouter.use('/idea', middleware.validateToken, ideaRouter);
basicRouter.use('/comment', middleware.validateToken, commentRouter);

module.exports = {
    basicRouter
}

// 토큰이 정상 -> 로그아웃을 누르면 validateToken -> 
// 토큰이 비정상 -> 새로고침 시 verifyToken -> 
//
//