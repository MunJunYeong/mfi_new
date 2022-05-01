const {anonymous: anonymousService } = require('../../service');
const {user : userService} = require('../../service');
const { Op } = require('../../lib/db');
const {pagination, utils} = require('../../lib/common');
const winston = require('../../lib/common/winston');

let checkEng = /[a-zA-Z]/;
let checkNum = /[0-9]/; 
let checkSpe = /[~!@#$%^&*()_+|<>?:{}]/;
let checkKor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;


//회원가입
const signUP = async (req, res) => {
    const data = req.body;

    if(!data.id || !data.pw || !data.nickName || !data.email){
        throw new Error('NOT_FOUND');
    }else if(data.pw.length <=5){
        throw new Error('MINIMUM6');
    }else if(!checkEng.test(data.pw) || !checkNum.test(data.pw) || !checkSpe.test(data.pw)){
        throw new Error('NOT_CORRECT_FORM');
    }

    try{
        const result = await anonymousService.signUp(data.id, data.pw, data.nickName, data.email, 'normal');
        //userToken 만드는 트랜잭션은 service레이어에서 동시에 실행
        // await anonymousService.makeUserToken(result.userIdx);
        res.send({data : result});
    }catch(err){
        if(err.message){
            throw new Error(err.message);
        }else {
            winston.error(`Unable to signup :`, err);
            throw new Error('UNABLE_SIGNUP');
        }

    }
    
}

const sendEmail = async (req, res) => {
    const data = req.body;
    if(!data.email){
        throw new Error('ENTER_EMAIL');
    }
    if(!utils.validationEmail(data.email)){
        throw new Error('NOT_CORRECT_EMAIL');
    }
    try{
        const result = await anonymousService.sendEmail(data.email);
        res.send({data : result.dataValues.idx});
    }catch(err){
        if(err.message){
            throw new Error(err.message);
        }else {
            winston.error(`Unable to sendEmail :`, err);
            throw new Error('UNABLE_SEND_MAIL')
        }
    }
}
const checkEmail = async (req, res) => {
    const data = req.body;
    
    if(!data.email && !data.no){
        throw new Error('ENTER_VALUE');
    }else if(!data.no){
        throw new Error('REQUIRED_AUTH_NUBER');
    }else if(!data.email){
        throw new Error('ENTER_EMAIL');
    }
    try{
        await anonymousService.checkEmail(data.email, data.no);
        res.send({data : 1});
    }catch(err){
        (err.message)
        if(err.message){
            throw new Error(err.message);
        }else {
            winston.error(`Unable to checkEmail :`, err);
            throw new Error('UNABLE_CHECK_MAIL');
        }
    }
}
//find Id, Pw
const findIdSendMail = async(req, res) => {
    const data = req.body;
    // front에서 막아놨기에 비정상적인 접근으로 이메일을 쏜거임
    if(!data.email){
        throw new Error('WRONG_ACCESS');
    }
    try{
        const result = await anonymousService.findIdSendMail(data.email);
        res.send(result);
    }catch(err){
        if(err.message){
            throw new Error(err.message);
        }
        winston.error(`Unable to sendMail for findId :`, err);
        throw new Error('UNABLE_FIND_ID_SEND_MAIL');
    }
    
}
const findPwSendMail = async(req, res) => {
    const data = req.body;
    // front에서 막아놨기에 비정상적인 접근으로 이메일을 쏜거임
    if( data.id === '' || data.email === '' || data.id === null || data.email === null ){
        throw new Error('WRONG_ACCESS');
    }
    try{
        const result = await anonymousService.findPwSendMail(data.id, data.email);
        res.send(result);
    }catch(err){
        if(err.message){
            throw new Error(err.message);
        }
        winston.error(`Unable to sendMail for findPw :`, err);
        throw new Error('UNABLE_FIND_PW_SEND_MAIL');
    }
    
    
}
const updatePw = async(req, res) => {
    const data = req.body; // data -> email, pw, id
    // front에서 막아놨기에 비정상적인 접근으로 이메일을 쏜거임
    if(data.email === '' || data.pw === '' || data.id === ''){
        throw new Error('WRONG_ACCESS');
    }
    try{
        const result = await anonymousService.updatePw(data.email, data.pw, data.id);
        res.send({data : result[0]});
    }catch(err){
        winston.error(`Unable to updatePw :`, err);
        throw new Error('UNABLE_UPDATE_PW');
    }
}

//로그인
const signIn = async (req, res) => {
    const data = req.body;

    if(!data.id || !data.pw){
        throw new Error('ENTER_VALUE');
    }

    try{
        const result = await anonymousService.signIn(data.id, data.pw);
        res.send(result);
    }catch(err){
        if(err.message){
            throw new Error(err.message);
        }
        winston.error(`Unable to signIn :`, err);
        throw new Error('UNABLE_SIGNIN');
    }
}


const forcesignIn= async(req, res) => {
    const data = req.body;

    if(!data.id || !data.pw){
        throw new Error('ENTER_VALUE');
    }
    let userIdx;
    //해당 id pw의 userIdx를 가지고 온다.
    try{
        userIdx = await anonymousService.findIdUser(data.id, data.pw);
    }catch(err){
        if(err.message){
            throw new Error(err.message);
        }
        winston.error(`Unable to findIdUser :`, err);
        throw new Error('UNABLE_FIND_ID_USER');
    }
    try{
        //userIdx에 해당하는 토큰을 로그아웃 시킨다.
        await userService.logout(userIdx);
        const result = await anonymousService.signIn(data.id, data.pw);
        res.send(result);
    }catch(err){
        if(err.message){
            throw new Error(err.message);
        }
        winston.error(`Unable to forcesignIn :`, err);
        throw new Error('UNABLE_FORCE_SIGNIN');
    }

}

//아이디 중복확인
const checkId = async (req, res) =>{
    const data = req.body;

    if(!data.id){
        throw new Error('ENTER_ID');
    }else if(checkKor.test(data.id) || !checkEng.test(data.id) || !checkNum.test(data.id)){
        throw new Error('USE_ENGNO');
    }else if(data.id.length <6){
        throw new Error('MINIMUM6');
    }
    try{
        const result = await anonymousService.duplicateId(data.id);
        if(result){
            res.send({
                value : 'false',
                message : '존재하는 ID입니다.'})
            return;
        }else {
            res.send({
                value : 'true',
                message : '사용가능한 ID입니다!'})
            return;
        }
    }catch(err){
        winston.error(`Unable to checkId(duplicate) :`, err);
        throw new Error('UNABLE_CHECKID');
    }
    
}
const checkNickName = async (req, res) => {
    const data = req.body;
    
    if(data.nickName <3){
        throw new Error('AT_LEAST3');
    }

    try{
        const result = await anonymousService.duplicateNickName(data.nickName);
        if(result){
            res.send({
                value : 'false',
                message : '존재하는 닉네임입니다.'})
            return;
        }else {
            res.send({
                value : 'true',
                message : '사용가능한 닉네임입니다!'})
            return;
        }
    }catch(err){
        winston.error(`Unable to checkNickName(duplicate) :`, err);
        throw new Error('UNABLE_CHECKNICKNAME');
    }

}


const logout = async(req, res) => {
    const data = req.body;
    try{
        const result = await userService.logout(data.userIdx);
        res.send(result)
    }catch(err){
        if(err.message){
            throw new Error(err.message);
        }
        winston.error(`Unable to logout :`, err);
        throw new Error('UNABLE_LOGOUT');
    }
}





module.exports = {
    signUP,
    sendEmail,
    checkEmail,
    signIn,
    forcesignIn,
    checkId,
    checkNickName,
    findIdSendMail,
    findPwSendMail,
    updatePw,
    logout,
}