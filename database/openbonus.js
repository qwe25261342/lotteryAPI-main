"use strict"
const schedule = require('node-schedule');
const runQuery = require('./runquery');
const shuffle1 = require('./shuffle');
const exchange = require('./exchange')
const moment = require('moment');
const logger = require('../database/enve')

async function call() {
    const getopent = `SELECT issue FROM lottery_issues WHERE status = 0 AND close_at < ? `
    const time = new Date()
    const close_time = moment(Date.parse(time)).format('YYYY-MM-DDTHH:mm')
    const result = await runQuery(getopent, close_time)
    console.log(close_time);
    for (let i = 0; i < result.length; i++) {
        const issue = result[i].issue
                const ball = await shuffle1()
                const n1 = ball[0]
                const n2 = ball[1]
                const n3 = ball[2]
                const n4 = ball[3]
                const n5 = ball[4]
                const params = [n1, n2, n3, n4, n5, time, issue]
                const setissue = `UPDATE lottery_issues SET n1 = ?, n2= ?, n3= ?, n4= ?, n5= ?, updated_at= ?, status=1 WHERE status = 0 AND issue=?`
                await runQuery(setissue, params)
                logger.openBall("openball")
                const getIssue = `SELECT issue FROM lottery_issues WHERE status=0 AND open_at <= ? AND close_at > ?`
                const alltime = [close_time,close_time]
                await runQuery(getIssue,alltime)
                logger.evenIssue("nextIssue")
        }   
}
let rule = new schedule.RecurrenceRule();
rule.second = [0, 10, 20, 30, 40, 50];// 每隔 10秒执行一次

// 启动任务
let job = schedule.scheduleJob(rule, () => {
    call()
    exchange()
});

module.exports = call