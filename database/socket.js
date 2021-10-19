"use strict"
const lottery = (io) => {
    const openbonus = require('./openbonus');
    const logger = require('./event');
    //收到值 用socket emit傳送給前端
    logger.on('openBall', a => {
        io.emit('receive-openBall', a)
    });

    logger.on('getIssue', param => {
        io.emit('receive-issue', param)
    });
    //socket連接
    io.on('connection', socket => {
        // console.log(socket.id);
    });
}
module.exports = {
    lottery
}