"use strict"
const express = require('express');
const router = express.Router();
const controllersAuth = require('../controllers/mysql');



router.get('/login', controllersAuth.login);
router.post('/register', controllersAuth.register);
router.post('/getuser', controllersAuth.getuser);
router.post('/setball', controllersAuth.setball);
router.post('/history', controllersAuth.history);
router.post('/setIssue', controllersAuth.setIssue);


module.exports = router;