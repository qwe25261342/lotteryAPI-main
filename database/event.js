"use strict"
const EventEmitter = require('events');

//值傳送給socket
class Logger extends EventEmitter {
    openBall(openBall) {
        this.emit('openBall', openBall);
        // console.log(openBall);
    }
    evenIssue(param){
        this.emit('getIssue', param)
        //console.log(param);
    }
}

const logger = new Logger()
module.exports = logger;