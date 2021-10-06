"use strict"
const moment = require('moment');
const uuid = require('uuid');
const runQuery = require('../database/runquery')
const shuffle1 = require('../database/shuffle')
const checkNewElement = require('../database/exchange')
const schedule = require('node-schedule');
const axios = require('axios')


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
    const sql = `SELECT  issue, settle_n1, settle_n2, settle_n3, settle_n4, settle_n5, status, gain_amount,id FROM settle_history WHERE user_id = ?`
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
    const created_at = new Date()
    const updated_at= new Date()
    let open_start = 1633017600000//2021-10-01 00:00:00
    const open_end = 1635695940000 //2021-10-31 23:59:00
    for (let i = 1633017600; i < 1635695940; i = i + 600) {
      open_start = open_start + 600000
      const issue = moment(open_start).format('YYYYMMDDHHmm')
      //console.log(issue);//期數
      const opent_at = moment(open_start).format('YYYY-MM-DDTHH:mm')
      const close_time = open_start + 540000
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
//開獎
exports.draw = async (req, res) => {
  try {
    const ball = await shuffle1()
    const n1 = ball[0]
    const n2 = ball[1]
    const n3 = ball[2]
    const n4 = ball[3]
    const n5 = ball[4]
    const open_start = new Date()
    const issue = moment(open_start).format('YYYYMMDDHHmm')
    console.log(issue);
    const updated_at =new Date()
    const params = [n1, n2, n3, n4, n5, updated_at, issue]
    const setissue = `UPDATE lottery_issues SET n1 = ?, n2= ?, n3= ?, n4= ?, n5= ?, updated_at= ?, status=1 WHERE issue = ?`
    const result = await runQuery(setissue, params)
    res.send({
      result
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
  try{
    const getOpenLottery = `SELECT issue, n1, n2, n3,n4, n5 FROM lottery_issues WHERE status = 1`
    const result = await runQuery(getOpenLottery)
    res.send(result)
  }catch(error){
    console.log(error);
    res.send({
      message: error
    })
  }

}
//兌獎
exports.exchange = async(req,res) =>{
  try{ 
    const req_params = req.body
    const token = req_params.token;
    const getId = 'SELECT user_id FROM tokens WHERE tokens= ?'
    const user_id = await runQuery(getId, token)
    const user_id1 = user_id[0].user_id;
    const sql = `SELECT issue, settle_n1, settle_n2, settle_n3, settle_n4, settle_n5 FROM settle_history WHERE user_id = ?`
    const getIssue = await runQuery(sql, user_id1)
    const newball = []
    const newsettle = []
    for( let i=0; i<getIssue.length; i++){
     const issue = getIssue[i].issue
      const getlottery = `SELECT n1,n2,n3,n4,n5 FROM lottery_issues WHERE issue =?`
      //從期數取開獎號碼
      const result = await runQuery(getlottery, issue)
      //購買號碼,開獎號碼傳進新陣列
      newball.push([result[0].n1, result[0].n2, result[0].n3, result[0].n4 ,result[0].n5])
      newsettle.push([ getIssue[i].settle_n1, getIssue[i].settle_n2, getIssue[i].settle_n3, getIssue[i].settle_n4 ,getIssue[i].settle_n5])
      const arrA =newball[i]
      const arrB = newsettle[i]
      checkNewElement(arrA,arrB)
      console.log(newball[i]);
      console.log(newsettle[i]);
    }
    res.send("123")
  }catch(error){
    console.log(error);
    res.send({
      message: error
    })
  }
}



let rule = new schedule.RecurrenceRule();
rule.minute   = [0, 10, 20, 30, 40, 50]; // 每隔 10 分执行一次

// 启动任务
let job = schedule.scheduleJob(rule, () => {
  axios.post( "http://localhost:3050/draw")
});