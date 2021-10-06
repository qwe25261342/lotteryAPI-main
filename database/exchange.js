
const checkNewElement = function (arrA, arrB) {
    const newArray = arrB.filter((element) => arrA.indexOf(element) === -1)
    // const giveAmount = 'UPDATE settle_history SET status= 1, gain_amount = ?, updated_at = ? WHERE id= ? '
    if (newArray.length == 3) {
        
        console.log("中2倍");
        return 
    }
    if (newArray.length == 2) {
        console.log("中5倍");
        return
    }
    if (newArray.length == 1) {
        console.log("中500倍");
        return
    }
    if (newArray.length == 0) {
        console.log("中1000倍");
        return
    }
    console.log("沒中");
    return

}
module.exports = checkNewElement