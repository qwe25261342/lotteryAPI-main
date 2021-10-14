"use strict"
//從shuffle陣列中隨機生成一個索引
//再從shuffle陣列中刪除第幾個索引的元素,並推到新的res陣列中
let shuffle  = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]
function shuffle1 ()  {
    let arr = shuffle
    let res = [], random
    while (arr.length > 0) {
        random = parseInt(Math.random() * arr.length)
        res.push(arr.splice(random, 1)[0])
    }
    shuffle = res
    return res.slice(0, 5)
}
module.exports = shuffle1