"use strict"
const moment = require('moment');
moment().format();
const uuid = require('uuid');
const runQuery = require('../database/runquery')
// const logger = require('../js/event');



//登入
exports.login = async (req, res) => {
  try {
    const req_params = req.query
    const account = req_params.account
    const password = req_params.password
    const created_at = new Date()
    const sql = 'SELECT id,account,password,nickname,balance FROM users WHERE account=? AND password=?'
    const params = [account, password]
    const result = await runQuery(sql, params);
    console.log(result);
    const deletetoken = 'DELETE FROM tokens WHERE user_id = ?'
    const user_id = result[0].id
    await runQuery(deletetoken, user_id);
    const addtoken = 'INSERT INTO tokens(tokens,user_id,created_at) VALUES( ?, ?, ?)'
    const tokenparams = [uuid.v1().toString(), user_id, created_at]
    await runQuery(addtoken, tokenparams);
    const usetoken = 'SELECT tokens FROM tokens WHERE user_id = ?'
    await runQuery(usetoken, user_id);
    res.send({ data: result, success: true, message: '登入成功!', token: tokenparams[0] })
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: '登入失败！'
    })
  }
}
//註冊
exports.register = async (req, res) => {
  try {
    const req_params = req.query
    const account = req_params.account
    const password = req_params.password
    const nickname = req_params.nickname
    const created_at = new Date()
    const params = [account, password, nickname, created_at]
    const sql = 'INSERT INTO users(account,password,nickname,balance,created_at) VALUES( ?, ?, ?, 1000, ? )'
    await runQuery(sql, params);
    res.send({ success: true, message: '註冊完成！' })
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: '註冊失败！'

    })
  }
}
//取得使用者
exports.getuser = async (req, res) => {
  try {
    const req_params = req.body.params
    const token = req_params.token;
    const getId = 'SELECT user_id FROM tokens where tokens= ? '
    const user_id = await runQuery(getId, token)
    const getUser = 'SELECT nickname, balance FROM users'
    const result = await runQuery(getUser, user_id)
    res.send(result)
  } catch (error) {
    console.log(error);
    res.send({
      errorMessage: error

    })
  }
}
//投注資料
exports.setball = async (req, res) => {
  try {
    const req_params = req.body.params
    const settle_n1 = req_params.n1
    const settle_n2 = req_params.n2
    const settle_n3 = req_params.n3
    const settle_n4 = req_params.n4
    const settle_n5 = req_params.n5
    const created_at = new Date()
    const updated_at = new Date()
    // const issue =
    const token = req_params.token;
    const getId = 'SELECT user_id FROM tokens WHERE tokens= ? '
    const user_id = await runQuery(getId, token)
    const user_id1 = user_id[0].user_id;
    const params = [user_id1, settle_n1, settle_n2, settle_n3, settle_n4, settle_n5, updated_at, created_at]
    const sql = `INSERT INTO settle_history
    (user_id, issue, settle_n1, settle_n2, settle_n3, settle_n4, settle_n5, status, settle_amount, updated_at, created_at)
    VALUES( ?, 202110051200, ?, ?, ?, ?, ?, 0, 50, ?, ?)`
    const result = await runQuery(sql, params)
    console.log(result);
    res.send({
      message: "購買成功"
    })
  } catch (error) {
    console.log(error);
    res.send({
      message: error
    })
  }
}
//投注紀錄
exports.history = async (req, res) => {
  try {
    const req_params = req.body.params
    const token = req_params.token;
    const getId = 'SELECT user_id FROM tokens WHERE tokens= ? '
    const user_id = await runQuery(getId, token)
    const user_id1 = user_id[0].user_id;
    const sql = `SELECT  issue, settle_n1, settle_n2, settle_n3, settle_n4, settle_n5, status, gain_amount,id FROM settle_history WHERE user_id`
    const result = await runQuery(sql, user_id1)
    console.log(result)
    res.send(result)
  } catch (error) {
    console.log(error);
    res.send({
      message: error
    })
  }
}
//增加期數
exports.setIssue = async (req, res) => {
  try {
    var day = new Date();
    const created_at = new Date()
    const updated_at = new Date()
    for (let i = 1633428660; i < 1635695999; i=i+600) {
        let ten = day.setMinutes(day.getMinutes() + 10)
        const issue = Math.floor(moment(ten).format('YYYYMMDDHHmm') / 10) + '0'
        const open_day = moment().valueOf();
        const open_at =  (moment(open_day).format("YYYY-MM-DDTHH:mm") )
        // const close_at = (moment(ten).format('YYYY-MM-DDTHH:mm') )
        console.log(open_at);
        // if( open_day%600 == 9 ){
        //   const open_day =  (moment(ten).format("YYYY-MM-DDTHH:mm") )
        //   console.log(open_day);
        // }
        // console.log(issue);
        // const setissue = `INSERT INTO lottery_issues 
        //        (issue,  updated_at, created_at)
        //        VALUES ( ?, ?, ?)`
        // const params = [issue, updated_at, created_at]
        // await runQuery(setissue, params)
    }
    // res.send({
    //   message: "增加期數成功"
    // })
  } catch (error) {
    console.log(error);
    res.send({
      message: error
    })
  }
}

