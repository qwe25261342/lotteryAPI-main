"use strict"
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();
const bodyParser = require('body-parser');
const http = require('http');
const server = http.createServer(app);
const socketIO = require('socket.io')
const cors = require('cors');


app.use(cookieParser());
app.use(cors());
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:8080",
    optionsSuccessStatus: 200,
    methods: "GET, POST",
    credentials: true
  }
});
const ws = require('./database/socket');
ws.lottery(io)


app.use(bodyParser.json());
const indexRouter = require('./routes/index');
//解析網址-由 html 表单發送
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);



server.listen(3050, () => console.log('http://localhost:3050'));
