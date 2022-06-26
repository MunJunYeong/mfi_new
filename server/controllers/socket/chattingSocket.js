const disconnectChattingEvent = (socket, io) => () =>  {
    console.log('chatting socket 연결 끊김');
    delete socket.nsp.userMap[socket.user.userIdx];
    console.log(socket.rooms);
    io.emit('connecting_user', Object.values(socket.nsp.userMap));
};

const quitChatting = (socket, io) => (data) => {
    socket.leave(data.roomName);
    console.log(data);
    io.to(data.roomName).emit('sendQuitChatting', data);
}

const toApplyChatting =  (socket, io)=> (userIdx)=> {
    let toSocketId = socket.nsp.userMap[userIdx].socket;
    let tempSocket = socket.user;
    tempSocket.target = socket.nsp.userMap[userIdx];
    io.to(toSocketId).emit('applyResponse', tempSocket);
}
const sendResultApply =  (socket, io)=> (data)=> {
    if(!data.flag){
        io.to(data.target.socket).emit('rejectChatting', socket.user.nickName); return;
    }
    //room naming 건 사람 - 수락한 사람
    const roomName = `${data.userIdx}-${socket.user.userIdx}`;
    socket.join(roomName);
    data.roomName = roomName;
    io.to(data.socket).emit('joinRoom', data);
}
const joinTargetRoom = (socket, io)=>(data)=> {
    socket.join(data.roomName);
    io.to(data.target.socket).emit('joinTargetRoom', data);
    console.log(io.adapter.rooms);
}
const sendMsg = (socket, io)=> (data) => {
    const splitString = data.roomName.split('-');
    const before = splitString[0];
    const after = splitString[1];
    let targetIdx;
    data.userIdx === Number(before) ? targetIdx= Number(after) : targetIdx = Number(before);
    io.to(socket.nsp.userMap[targetIdx].socket).emit('receiveMsg', data);
}


const socketError = (socket, io)=>(err)=> {
    console.log(err);
}

const disconnecting = (socket, io) => (data) => {
    console.log('disconnecting!!!!!!')

    console.log(socket.rooms);
    for (let item of socket.rooms.keys()) {
        if(item != socket.id) {
            const msg = {
                userIdx: socket.user.userIdx,
                roomName: item,
            }
            console.log(msg);
            io.to(item).emit('sendQuitChatting', msg);
            console.log(item);
        }
    }
    

    console.log('finish!!!!!    disconnecting!!!!!!')
}

module.exports = {
    disconnectChattingEvent,
    toApplyChatting,
    socketError,
    sendResultApply,
    joinTargetRoom,
    sendMsg,
    quitChatting,
    disconnecting,
}