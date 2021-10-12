"use strict"
const express = require('express');
const router = express.Router();
const controllersAuth = require('../controllers/mysql');
const runQuery = require('../database/runquery');


router.use('/token', async (req, res, next) => {
    try {
        const req_params = req.body
        const token = req_params.token
        const msgToken = 'SELECT user_id FROM tokens where tokens= ? '
        const result = await runQuery(msgToken, token)
        req.user_id = result
        next();
    } catch (error) {
        res.send({
            success: false,
            message: error
        })
    }
})


router.get('/login', controllersAuth.login);
router.post('/register', controllersAuth.register);
router.post('/token/getuser', controllersAuth.getuser);
router.post('/token/setball', controllersAuth.setball);
router.post('/token/history', controllersAuth.history);
router.post('/setIssue', controllersAuth.setIssue);
router.post('/status', controllersAuth.status);
router.post('/thisIssue', controllersAuth.thisIssue);

module.exports = router;