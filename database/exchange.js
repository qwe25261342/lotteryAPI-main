"use strict"
const runQuery = require('./runquery');

async function exchange() {
    try {
        const sql = `SELECT * FROM settle_history WHERE status=0`
        const issuesArr = []
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
        //判斷是否存在temp_table這張表
        const create_table = `CREATE TABLE temp_table (id VARCHAR(255), user_id VARCHAR(255), balance VARCHAR(255), gain_amount VARCHAR(255),status VARCHAR(255) ,updated_at datetime)`
        const table = `SELECT table_name FROM information_schema.TABLES WHERE table_name ='temp_table'`
        await runQuery(create_table)
        const haveTable = await runQuery(table)
        for (let i = 0; i < result.length; i++) {
            if (haveTable.length == 0) {
                return
            }
            const arrA = map.get(result[i].issue)
            const arrB = [result[i].settle_n1, result[i].settle_n2, result[i].settle_n3, result[i].settle_n4, result[i].settle_n5]
            const newArray = arrB.filter((element) => arrA.indexOf(element) === -1)
            const giveaMountId = result[i].user_id;
            const dataID = result[i].id;
            const userID = result[i].user_id;
            const amount = result[i].settle_amount;
            const giveMoney = `INSERT INTO temp_table ( id, user_id, balance, status, gain_amount, updated_at) VALUES( ?, ?, ?, 1, ?, ? )`
            const getbalance = `SELECT id, balance FROM users WHERE id=? `
            const idBalance = await runQuery(getbalance, giveaMountId)
            if (newArray.length == 3) {
                const balance = idBalance[0].balance + amount * 2;
                const params = [dataID, userID, balance, amount * 2, updated_at]
                await runQuery(giveMoney, params)
                console.log("中2倍");
                continue
            }
            if (newArray.length == 2) {
                const balance = idBalance[0].balance + amount * 5;
                const params = [dataID, userID, balance, amount * 5, updated_at]
                await runQuery(giveMoney, params)
                console.log("中5倍");
                continue
            }
            if (newArray.length == 1) {
                const balance = idBalance[0].balance + amount * 500;
                const params = [dataID, userID, balance, amount * 500, updated_at]
                await runQuery(giveMoney, params)
                console.log("中500倍");
                continue
            }
            if (newArray.length == 0) {
                const balance = idBalance[0].balance + amount * 1000;
                const params = [dataID, userID, balance, amount * 1000, updated_at]
                await runQuery(giveMoney, params)
                console.log("中1000倍");
                continue
            }
            else {
                const balance = idBalance[0].balance + amount * 0;
                const params = [dataID, userID, balance, amount * 0, updated_at]
                await runQuery(giveMoney, params)
                console.log("沒中");
                continue
            }
        }
        if (haveTable.length != 0) {
            const joinTest = `UPDATE settle_history a 
                                INNER JOIN(
                                    SELECT 
                                        t.id, t.gain_amount, t.status, t.updated_at
                                    FROM 
                                        temp_table t
                                        ) b ON a.id = b.id 
                                    SET 
                                        a.gain_amount = b.gain_amount, a.status = b.status, a.updated_at = b.updated_at`
            await runQuery(joinTest)
            const joinUsers = `UPDATE users a
                                INNER JOIN(
                                    SELECT
                                        t.user_id, t.balance, t.updated_at
                                    FROM
                                        temp_table t
                                        ) b ON a.id = b.user_id
                                    SET
                                        a.balance = b.balance, a.updated_at = b.updated_at`
            await runQuery(joinUsers)
            const deleteTemp = `DROP TABLE temp_table`
            await runQuery(deleteTemp)
        }
    } catch (error) {
        console.log(error);
    }
}
module.exports = exchange