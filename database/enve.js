"use strict"
const EventEmitter = require('events');

//值傳送給socket
class Logger extends EventEmitter {
    log(arr) {
        this.emit('openBall', arr);
        console.log(arr);
    }
}

const logger = new Logger()
module.exports = logger;