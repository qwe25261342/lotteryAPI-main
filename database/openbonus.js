"use strict"
const schedule = require('node-schedule');
const runQuery = require('./runquery');
const shuffle1 = require('./shuffle');
const exchange = require('./exchange')
const moment = require('moment');

const getopent = `SELECT open_at, status FROM lottery_issues`

async function call() {
    const time = new Date()
    const nowTime = Date.parse(time) -600000;
    try {
        const result = await runQuery(getopent)
        for (let i = 0; i < result.length; i++) {
            const openTime = Date.parse(result[i].open_at);
            if (openTime < nowTime || openTime == nowTime) {
                const ball = await shuffle1()
                const n1 = ball[0]
                const n2 = ball[1]
                const n3 = ball[2]
                const n4 = ball[3]
                const n5 = ball[4]
                const open_at = moment(openTime).format('YYYY-MM-DDTHH:mm')
                const params = [n1, n2, n3, n4, n5, time, open_at]
                console.log("123");
                const setissue = `UPDATE lottery_issues SET n1 = ?, n2= ?, n3= ?, n4= ?, n5= ?, updated_at= ?, status=1 WHERE status = 0 AND open_at=?`
                await runQuery(setissue, params)
            }else{
                return
            }
        }
    } catch (error) {
        console.log(error);
    }
}


call()
exchange()
let rule = new schedule.RecurrenceRule();
rule.second = [0, 10, 20, 30, 40, 50];// 每隔 1 分执行一次

// 启动任务
let job = schedule.scheduleJob(rule, () => {
    // exchange()
    // call()
});