"use strict"
const lottery = (io) => {
    const call = require('./openbonus');
    const logger = require('./enve');
    call()
    let map = { }
    //收到值 用socket emit傳送給前端
    logger.on('openBall', a => {
        console.log('22222');
        io.emit('receive-openBall', a)
    });

    logger.on('getIssue', param => {
        // console.log(param);
        io.emit('receive-issue', param)
    });


    //socket連接
    io.on('connection', socket => {
        console.log(socket.id);
        map = io;
    });

}
module.exports = {
    lottery
}