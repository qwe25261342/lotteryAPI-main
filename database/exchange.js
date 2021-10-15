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
        if(issue.length ==0){
            return
        }
        const getlotteryIssue = `SELECT issue, n1, n2, n3, n4, n5 FROM lottery_issues WHERE status = 1 AND issue IN (${issue})`
        const lotteryIssue = await runQuery(getlotteryIssue)
        //還沒開獎return掉
        if(lotteryIssue.length == 0){
            console.log("[ 未開獎 ]");
            return
        }
        const map = new Map()
        for (let i = 0; i < lotteryIssue.length; i++) {
            map.set(lotteryIssue[i].issue, [lotteryIssue[i].n1, lotteryIssue[i].n2, lotteryIssue[i].n3, lotteryIssue[i].n4, lotteryIssue[i].n5])
        }
        for (let i = 0; i < result.length; i++) {
            const arrA = map.get(result[i].issue)
            const arrB = [result[i].settle_n1, result[i].settle_n2, result[i].settle_n3, result[i].settle_n4, result[i].settle_n5]
            const newArray = arrB.filter((element) => arrA.indexOf(element) === -1)
            const giveaMountId = result[i].user_id;
            const dataID = result[i].id;
            const amount = result[i].settle_amount;
            const updatedBalance = `UPDATE users SET balance=?, updated_at=? WHERE id=?`
            const giveamount = `UPDATE settle_history SET status = 1, gain_amount =?, updated_at=? WHERE id=? AND status =0 `
            const getbalance = `SELECT id, balance FROM users WHERE id=? `
            const idBalance = await runQuery(getbalance, giveaMountId)
            if (newArray.length == 3) {
                const params = [amount * 2, updated_at, dataID]
                await runQuery(giveamount, params)
                const balance = idBalance[0].balance + amount * 2;
                const giveMoney = [balance, updated_at, giveaMountId]
                await runQuery(updatedBalance, giveMoney)
                console.log("中2倍");
                continue
            }
            if (newArray.length == 2) {
                const params = [amount * 5, updated_at, dataID]
                await runQuery(giveamount, params)
                const balance = idBalance[0].balance + amount * 5;
                const giveMoney = [balance, updated_at, giveaMountId]
                await runQuery(updatedBalance, giveMoney)
                console.log("中5倍");
                continue
            }
            if (newArray.length == 1) {
                const params = [amount * 500, updated_at, dataID]
                await runQuery(giveamount, params)
                const balance = idBalance[0].balance + amount * 500;
                const giveMoney = [balance, updated_at, giveaMountId]
                await runQuery(updatedBalance, giveMoney)
                console.log("中500倍");
                continue
            }
            if (newArray.length == 0) {
                const params = [amount * 1000, updated_at, dataID]
                await runQuery(giveamount, params)
                const balance = idBalance[0].balance + amount * 1000;
                const giveMoney = [balance, updated_at, giveaMountId]
                await runQuery(updatedBalance, giveMoney)
                console.log("中1000倍");
                continue
            }
            else {
                const params = [amount * 0, updated_at, dataID]
                await runQuery(giveamount, params)
                console.log("沒中");
                continue
            }
        }
        
    } catch (error) {
        console.log(error);
        
    }
}
module.exports = exchange