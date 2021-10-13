"use strict"
const runQuery = require('./runquery');

async function exchange() {
    try {
        //取購買過未兌獎的資料
        const sql = `SELECT id, user_id, issue, settle_n1, settle_n2, settle_n3, settle_n4, settle_n5, settle_amount FROM settle_history WHERE status=0`
        const updated_at = new Date()
        const getHistory = await runQuery(sql)
        for (let i = 0; i < getHistory.length; i++) {
            const issue = getHistory[i].issue;
            const giveaMountId = getHistory[i].user_id;
            const dataID = getHistory[i].id;
            //取得購買金額
            const amount = getHistory[i].settle_amount;
            //從購買過的期數取相對應期數的開獎球號
            const getlottery = `SELECT n1,n2,n3,n4,n5 FROM lottery_issues WHERE issue =? AND status = 1`
            //取得相對應的ID,取user點數
            const getbalance = `SELECT id, balance FROM users WHERE id=? `
            const idBalance = await runQuery(getbalance,  giveaMountId)
            const result = await runQuery(getlottery, issue)
            const arrA = [result[0].n1, result[0].n2, result[0].n3, result[0].n4, result[0].n5]
            const arrB = [getHistory[i].settle_n1, getHistory[i].settle_n2, getHistory[i].settle_n3, getHistory[i].settle_n4, getHistory[i].settle_n5]
            const newArray = arrB.filter((element) => arrA.indexOf(element) === -1)
            //更新購買紀錄 結算與獲得金額(兌獎)
            const giveamount = `UPDATE settle_history SET status = 1, gain_amount =?, updated_at=? WHERE id=? AND status =0 `
            //更新user的點數
            const updatedBalance = `UPDATE users SET balance=?, updated_at=? WHERE id=?`
            if (newArray.length == 3) {
                const params = [ amount*2, updated_at, dataID]
                await runQuery(giveamount, params)
                const balance = idBalance[0].balance +amount*2;
                const giveMoney = [ balance, updated_at, giveaMountId  ]
                await runQuery (updatedBalance, giveMoney)
                console.log("中2倍");
                continue
            }
            if (newArray.length == 2) {
                const params = [ amount*5, updated_at, dataID]
                await runQuery(giveamount, params)
                const balance = idBalance[0].balance +amount*5;
                const giveMoney = [ balance, updated_at, giveaMountId  ]
                await runQuery (updatedBalance, giveMoney)
                console.log("中5倍");
                continue
            }
            if (newArray.length == 1) {
                const params = [ amount*500, updated_at, dataID]
                await runQuery(giveamount, params)
                const balance = idBalance[0].balance +amount*500;
                const giveMoney = [ balance, updated_at, giveaMountId  ]
                await runQuery (updatedBalance, giveMoney)
                console.log("中500倍");
                continue
            }
            if (newArray.length == 0) {
                const params = [ amount*1000, updated_at, dataID]
                await runQuery(giveamount, params)
                const balance = idBalance[0].balance +amount*1000;
                const giveMoney = [ balance, updated_at, giveaMountId  ]
                await runQuery (updatedBalance, giveMoney)
                console.log("中1000倍");
                continue
            }
            else {
                const params = [ amount*0, updated_at, dataID]
                await runQuery(giveamount, params)
                console.log("沒中");
                continue
            }
        }
    } catch (error) {
        console.log("[ 未開獎 ]");
    }
}
module.exports = exchange