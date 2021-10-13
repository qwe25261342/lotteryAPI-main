"use strict"
const moment = require('moment');
const uuid = require('uuid');
const runQuery = require('../database/runquery')

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
    //console.log(result);
    const deletetoken = 'DELETE FROM tokens WHERE user_id = ?'
    const user_id = result[0].id
    await runQuery(deletetoken, user_id);
    const addtoken = 'INSERT INTO tokens(tokens,user_id,created_at) VALUES( ?, ?, ?)'
    const tokenparams = [uuid.v1().toString(), user_id, created_at]
    await runQuery(addtoken, tokenparams);
    const usetoken = 'SELECT tokens FROM tokens WHERE user_id = ?'
    await runQuery(usetoken, user_id);
    res.send({
      data: result, 
      success: true, 
      message: '登入成功!',
      token: tokenparams[0] 
    })
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
    const user_id = req.user_id[0].user_id;
    const getUser = 'SELECT nickname, balance FROM users where id= ?'
    const result = await runQuery(getUser, user_id)
    res.send(result)
    //console.log(result)
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      Message: error

    })
  }
}
//增加投注資料
exports.setball = async (req, res) => {
  try {
    const time = new Date()
    let open_start = Date.parse(time)
    const issue = Math.floor(moment(open_start).format('YYYYMMDDHHmm') / 10) + '0'
    const close_at = `SELECT close_at  FROM lottery_issues WHERE issue = ? `
    const close = await runQuery(close_at, issue)
    const closeTime = Date.parse(close[0].close_at);
    const user_id = req.user_id[0].user_id;
    //關盤一分鐘
    const closeOne = Date.parse(moment(closeTime).add(1, "m"))
    if (closeTime <= time && time <= closeOne) {
      console.log("關盤中");
      res.send({
        closing: true
      })
      return
    }
    const req_params = req.body.params
    const settle_n1 = req_params.n1
    const settle_n2 = req_params.n2
    const settle_n3 = req_params.n3
    const settle_n4 = req_params.n4
    const settle_n5 = req_params.n5
    //擋輸入值重複
    const newArr = [settle_n1, settle_n2, settle_n3, settle_n4, settle_n5];
    const repeat = newArr.filter((element, index, arr) => {
      return arr.indexOf(element) !== index;
    })
    if (repeat.length > 0) {
      res.send({
        repeat: true
      })
      return;
    }
    const getbalance = `SELECT id, balance FROM users WHERE id=? `
    const userBalance1 = await runQuery(getbalance, user_id)
    //餘額不足50
    if (userBalance1[0].balance < 50) {
      res.send({
        money: false
      })
      return;
    }
    const params = [user_id, issue, settle_n1, settle_n2, settle_n3, settle_n4, settle_n5, time, time]
    //增加投注資料
    const sql = `INSERT INTO settle_history
      (user_id, issue, settle_n1, settle_n2, settle_n3, settle_n4, settle_n5, status, settle_amount, updated_at, created_at)
       VALUES( ?, ?, ?, ?, ?, ?, ?, 0, 50, ?, ?)`
    await runQuery(sql, params)
    const userBalance = userBalance1[0].balance - 50;
    const updatedBalance = `UPDATE users SET balance=?, updated_at=? WHERE id=?`
    const updatedmoney = [userBalance, time, user_id]
    await runQuery(updatedBalance, updatedmoney)
    res.send({
      message: "購買成功",
      closing: false
    })

  } catch (error) {
    console.log(error);
    res.send({
      number: false,
      message: error
    })
  }
}
//投注紀錄
exports.history = async (req, res) => {
  try {
    const user_id = req.user_id[0].user_id;
    const sql = `SELECT  issue, settle_n1, settle_n2, settle_n3, settle_n4, settle_n5, status, gain_amount,id FROM settle_history WHERE user_id = ?`
    const result = await runQuery(sql, user_id)
    // console.log(result)
    res.send(result)
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: error
    })
  }
}
//增加期數
exports.setIssue = async (req, res) => {
  try {
    const created_at = new Date()
    const updated_at = new Date()
    let open_start = Date.parse(moment().startOf('day'))//今天開始的00:00:00.00
    const open_end = Date.parse(moment().endOf('month')) //2021-10-31 23:59:00
    for (let i = open_start; i < open_end; i = i + 600000) {
      open_start = Date.parse(moment(open_start).add(10, "m"))
      const issue = moment(open_start).format('YYYYMMDDHHmm')
      //console.log(issue);//期數
      const opent_at = moment(open_start).format('YYYY-MM-DDTHH:mm')
      const close_time = Date.parse(moment(open_start).add(9, "m"))
      const close_at = moment(close_time).format('YYYY-MM-DDTHH:mm')
      const setissue = `INSERT INTO lottery_issues 
             (issue,  open_at, close_at, updated_at, created_at)
             VALUES ( ?, ?, ?, ?, ?)`
      const params = [issue, opent_at, close_at, updated_at, created_at]
      await runQuery(setissue, params)
    }
    res.send({
      message: "增加期數成功"
    })
  } catch (error) {
    console.log(error);
    res.send({
      message: error
    })
  }
}

//取得已開獎紀錄
exports.status = async (req, res) => {
  try {
    const getOpenLottery = `SELECT issue, n1, n2, n3,n4, n5 FROM lottery_issues WHERE status = 1`
    const result = await runQuery(getOpenLottery)
    // console.log(result);
    res.send(result)
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: error
    })
  }
}
//取得本期期數
exports.thisIssue = async (req, res) => {
  try {
    const getIssue = `SELECT issue FROM lottery_issues WHERE status=0 LIMIT 1`
    const result = await runQuery(getIssue)
    res.send(result)
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: error
    })
  }
}