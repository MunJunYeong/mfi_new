const jwt = require('jsonwebtoken');
const redisClient = require('./redis');
const jwt_decode = require('jwt-decode');
const secret = process.env.SECRET;

const sign = (user) => {
    const payload = {
        ...user
    };
    return jwt.sign(payload, secret, {
        algorithm: 'HS256', // 암호화 알고리즘
        expiresIn: '2h', 	  // 유효기간
    })
}

const verify = (token) => {
    let userData = null;
    if(token === null) return 'need token';
    try {
        userData= jwt.verify(token, secret);
        return {
            ...userData
        }
    }catch(err){
        return 'accesstoken expired'
    }
}


//이중
const refresh = ()=> {
    const payload = {
    };
    return jwt.sign(payload, secret, { // refresh token은 payload 없이 발급
        algorithm: 'HS256',
        expiresIn: '14d',
      });
}

const refreshVerify = async (refreshToken, token)=> {
    let res = null;
    try {
        res = jwt.verify(refreshToken, secret);
    }catch(err){
        return err.message
    }
    //return이 안되었을 경우에는 refresh 토큰이 아직 유효함
    const userData = jwt_decode(token);
    delete userData.iat;
    delete userData.exp;
    const newToken = sign(userData);
    
    return {
        accessToken : newToken,
        userIdx : userData.userIdx 
    };
}



module.exports = {
    sign,
    verify,
    refresh,
    refreshVerify,
}