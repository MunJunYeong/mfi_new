
const {idea : ideaService} = require ('../../service');
const {pagination} = require('../../lib/common');


const getIdeaCount = async(req, res) => {
    try{
        const result = await ideaService.getIdeaCount();
        res.send({data : result});
    }catch(err){
        winston.warn(`Unable to getIdeaCout :`, err);
        throw new Error(17);
    }
    
}

const postIdea = async (req, res) => {
    const data = req.body;

    if(!data.subject){
        throw new Error(114);
    }else if(!data.content){
        throw new Error(115);
    }

    try{
        const result = await ideaService.createIdea(data.subject, data.content, req.userData.userIdx);
        res.send({data : result});
    }catch(err){
        winston.error(`Unable to postIdea :`, err);
        throw new Error(18);
    }
    
}

const deleteIdea = async (req, res) => {
    const ideaIdx = req.query.ideaIdx;
    if(!ideaIdx){
        throw new Error(116);
    }

    try{
        const result = await ideaService.deleteIdea(ideaIdx);
        res.send({success : '1'});
    }catch(err){
        winston.error(`Unable to deleteIdea :`, err);
        throw new Error(19);
    }
}
const updateIdea =  async (req, res) => {
    const ideaIdx = req.body.params.ideaIdx;
    const subject = req.body.params.subject;
    const content = req.body.params.content;
    if(!ideaIdx){
        throw new Error(116);
    }
    if(!subject){
        throw new Error(114);
    }
    if(!content){
        throw new Error(115);
    }

    try{
        const result = await ideaService.updateIdea(ideaIdx, subject, content);
        res.send({data : result});
    }catch(err){
        winston.error(`Unable to updateIdea :`, err);
        throw new Error(20);
    }

    

}
//click한 아이디어 가져오기
const getClickIdea = async (req, res) =>{
    const ideaIdx = req.params.ideaIdx;
    //아이디어 가져오는 절
    try{
        const result = await ideaService.getIdea(ideaIdx);
        res.send({data : result});
    }catch(err){
        winston.error(`Unable to getClickIdea :`, err);
        throw new Error('fail to getClickIdea');
    }
}

const showIdea = async (req, res) => {
    const {page, subject, order, role, userIdx, userRole} = req.query;
    const {limit, offset} = pagination.getPagination(page);
    
    try{
        const data = await ideaService.getAllIdea(limit, offset, subject, userIdx, userRole, order, role);
        const result = pagination.getPagingIdeaData(data, page, limit);
        res.send(result);
    }catch(err){
        winston.error(`Unable to showIdea :`, err);
        throw new Error(21);
    }
}
const showMyIdea = async (req, res) => {
    const {page, subject, userIdx} = req.query;
    const {limit, offset} = pagination.getPagination(page);

    try{
        const data = await ideaService.getMyIdea(limit, offset, subject, userIdx);
        const result = pagination.getPagingIdeaData(data, page, limit);
        res.send(result);
    }catch(err){
        winston.error(`Unable to showMyIdea :`, err);
        throw new Error(22);
    }
}
const showAdminUserIdea = async (req, res) => {
    const userIdx = req.params.userIdx;
    const {page, subject} = req.query;
    const {limit, offset} = pagination.getPagination(page);
    
    try{
        const data = await ideaService.getAdminUserIdea(limit, offset, subject, userIdx);
        const result = await pagination.getPagingIdeaData(data, page, limit);
        res.send(result);
    }catch(err){
        winston.error(`Unable to showAdminUserIdea :`, err);
        throw new Error(23);
    }

}
module.exports = {
    getIdeaCount,
    showIdea,
    showMyIdea,
    postIdea,
    deleteIdea,
    updateIdea,
    getClickIdea,
    showAdminUserIdea
}