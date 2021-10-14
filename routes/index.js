"use strict"
const express = require('express');
const router = express.Router();
const controllersAuth = require('../controllers/mysql');
const token = require('./token');

router.get('/login', controllersAuth.login);
router.post('/register', controllersAuth.register);
router.post('/token/getuser', token, controllersAuth.getuser);
router.post('/token/setball', token, controllersAuth.setball);
router.post('/token/history', token, controllersAuth.history);
router.post('/setIssue', controllersAuth.setIssue);
router.post('/status', controllersAuth.status);
router.post('/thisIssue', controllersAuth.thisIssue);

module.exports = router;