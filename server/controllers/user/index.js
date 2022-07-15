const {user : userService} = require('../../service');

const updateUserRole = async (req, res) => {
    const data = req.body;
    
    if(!data.role || !data.userIdx) throw new Error('WRONG_ACCESS');
    let result;
    try{
        result = await userService.updateRole(data.role, data.userIdx);
    }catch(err){
        if(err.message === 'DB_NOT_FOUND_USER')throw new Error(err.message);
        if(err.message === 'DB_UPDATE_ROLE')throw new Error(err.message);
        winston.error(`Unable to updateUserRole :`, err);throw new Error('UNABLE_USERROLE');
    }
    res.send(result)
}

const getuserData = async(req, res) => {
    const userIdx = req.params.userIdx;
    if(!userIdx) throw new Error('WRONG_ACCESS');
    let data;
    try{
        data = await userService.getUserData(userIdx);
    }catch(err){
        if(err.message === 'DB_GET_USER_DATA')throw new Error(err.message);
        winston.error(`Unable to getUserData :`, err);throw new Error('UNABLE_GET_USER_DATA');
    }
    res.send({data : data});
}
const getUser = async (req, res)=> {
    const {page, nickName} = req.query;
    try{
        const result = await userService.getUser(page, nickName);
        res.send(result);
    }catch(err){
        if(err.message === 'DB_GET_USER')throw new Error(err.message);
        winston.error(`Unable to getUser(role:admin) :`, err);throw new Error('UNABLE_GET_USER');
    }

}


module.exports = {
    getuserData,
    updateUserRole,
    getUser,
}