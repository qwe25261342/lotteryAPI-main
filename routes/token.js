"use strict"
const express = require('express');
const router = express.Router();
const runQuery = require('../database/runquery');

router.use('/token', async (req, res, next) => {
    try {
        const req_params = req.body
        const token = req_params.token
        const msgToken = 'SELECT user_id FROM tokens where tokens= ?'
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

module.exports = router;