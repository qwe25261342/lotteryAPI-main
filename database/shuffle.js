const shuffle1 = arr => {
    let res = [], random
    while (arr.length > 0) {
        random = parseInt(Math.random() * arr.length)
        res.push(arr.splice(random, 1)[0])
        
    }
    console.log(res.slice(0, 5));
    return res.slice(0, 5)
}

shuffle1([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]) 