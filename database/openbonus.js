"use strict"
const schedule = require('node-schedule');
const runQuery = require('./runquery');
const shuffle1 = require('./shuffle');
const exchange = require('./exchange')
const moment = require('moment');
const logger = require('../database/enve')

async function openbonus() {
    const getopent = `SELECT issue FROM lottery_issues WHERE status = 0 AND close_at < ? `
    const time = new Date()
    const close_time = moment(Date.parse(time)).format('YYYY-MM-DDTHH:mm')
    const result = await runQuery(getopent, close_time)
    //判斷是否存在temp_realname這張表
    const create_table = `CREATE TABLE temp_realname 
                            ( issue VARCHAR(255), n1 VARCHAR(255),n2 VARCHAR(255),n3 VARCHAR(255),n4 VARCHAR(255),n5 VARCHAR(255),status VARCHAR(255))`
    const table = `SELECT table_name FROM information_schema.TABLES WHERE table_name ='temp_realname'`
    // 無須開獎return
    if(result.length == 0){
        return
    }
    await runQuery(create_table)
    const haveTable = await runQuery(table)
    for (let i = 0; i < result.length; i++) {
        if (haveTable.length != 0) {
            const issue = result[i].issue
            const ball = await shuffle1()
            const n1 = ball[0]
            const n2 = ball[1]
            const n3 = ball[2]
            const n4 = ball[3]
            const n5 = ball[4]
            const params = [issue, n1, n2, n3, n4, n5]
            const setissue = `INSERT INTO temp_realname ( issue, n1, n2, n3, n4, n5, status) VALUES( ?, ?, ?, ?, ?, ?, 1 )`
            await runQuery(setissue, params)
        }
    }
    if (haveTable.length != 0) {
        const joinTest = `UPDATE lottery_issues a 
                            INNER JOIN(
                                SELECT 
                                    t.issue, t.n1, t.n2, t.n3, t.n4, t.n5, t.status 
                                FROM 
                                    temp_realname t
                                    ) b ON a.issue = b.issue 
                                SET 
                                    a.n1 = b.n1, a.n2 = b.n2, a.n3 = b.n3, a.n4 = b.n4, a.n5 = b.n5, a.status = b.status`
        await runQuery(joinTest)
        const deleteTemp = `DROP TABLE temp_realname`
        await runQuery(deleteTemp)
        logger.openBall("openball")
        logger.evenIssue("nextIssue")
    }
}
let rule = new schedule.RecurrenceRule();
rule.second = [0, 10, 20, 30, 40, 50];// 每隔 10秒执行一次
// 启动任务
let job = schedule.scheduleJob(rule, () => {
    openbonus()
    exchange()
});

module.exports = openbonus