"use strict"
const runQuery = require('./runquery');

async function exchange() {
    try {
        const sql = `SELECT * FROM settle_history WHERE status=0`
        const issuesArr = []
        let temp_tableArr = []
        const updated_at = new Date()
        const result = await runQuery(sql)
        for (let i = 0; i < result.length; i++) {
            issuesArr.push(result[i].issue)
        }
        const a = new Set([...issuesArr]);
        const issue = [...a];
        //無購買紀錄return掉
        if (issue.length == 0) {
            return
        }
        const getlotteryIssue = `SELECT issue, n1, n2, n3, n4, n5 FROM lottery_issues WHERE status = 1 AND issue IN (${issue})`
        const lotteryIssue = await runQuery(getlotteryIssue)
        //還沒開獎return掉
        if (lotteryIssue.length == 0) {
            console.log("[ 未開獎 ]");
            return
        }
        // 無須兌獎return
        if (result.length == 0) {
            return
        }
        const map = new Map()
        for (let i = 0; i < lotteryIssue.length; i++) {
            map.set(lotteryIssue[i].issue, [lotteryIssue[i].n1, lotteryIssue[i].n2, lotteryIssue[i].n3, lotteryIssue[i].n4, lotteryIssue[i].n5])
        }
        const create_table = `CREATE TEMPORARY TABLE temp_table 
                        (id VARCHAR(255), user_id VARCHAR(255), balance VARCHAR(255), gain_amount VARCHAR(255),status VARCHAR(255) ,updated_at datetime)`
        await runQuery(create_table)
        for (let i = 0; i < result.length; i++) {
            const arrA = map.get(result[i].issue)
            const arrB = [result[i].settle_n1, result[i].settle_n2, result[i].settle_n3, result[i].settle_n4, result[i].settle_n5]
            const newArray = arrB.filter((element) => arrA.indexOf(element) === -1)
            const dataID = result[i].id;
            const userID = result[i].user_id;
            const amount = result[i].settle_amount;
            let balance = Number
            if (newArray.length == 3) {
                temp_tableArr.push([dataID, userID, balance = amount * 2, amount * 2, updated_at, 1])
                console.log("中2倍");
                continue
            }
            if (newArray.length == 2) {
                temp_tableArr.push([dataID, userID, balance = amount * 5, amount * 5, updated_at, 1])
                console.log("中5倍");
                continue
            }
            if (newArray.length == 1) {
                temp_tableArr.push([dataID, userID, balance = amount * 500, amount * 500, updated_at, 1])
                console.log("中500倍");
                continue
            }
            if (newArray.length == 0) {
                temp_tableArr.push([dataID, userID, balance = amount * 1000, amount * 1000, updated_at, 1])
                console.log("中1000倍");
                continue
            }
            else {
                temp_tableArr.push([dataID, userID, balance = amount * 0, amount * 0, updated_at, 1])
                console.log("沒中");
                continue
            }
        }
        const giveMoney = `INSERT INTO temp_table ( id, user_id, balance, gain_amount, updated_at, status) VALUES ?`
        const params = [temp_tableArr]
        await runQuery(giveMoney, params)
        const joinTest = `UPDATE settle_history a 
                                INNER JOIN(
                                    SELECT 
                                        t.id, t.gain_amount, t.status, t.updated_at
                                    FROM 
                                        temp_table t) b
                                        ON a.id = b.id 
                                    SET 
                                        a.gain_amount = b.gain_amount, a.status = b.status, a.updated_at = b.updated_at`
        await runQuery(joinTest)
        const joinUsers = `UPDATE users a
                                INNER JOIN(
                                    SELECT
                                        t.user_id, t.updated_at, SUM(t.balance) as total
                                    FROM
                                        temp_table t
                                        GROUP BY t.user_id) b
                                        ON a.id = b.user_id
                                    SET
                                        a.balance = a.balance + total, a.updated_at = b.updated_at`
        await runQuery(joinUsers)
        const deleteTemp = `DROP TABLE temp_table`
        await runQuery(deleteTemp)
    } catch (error) {
        console.log(error);
    }
}
module.exports = exchange