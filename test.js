// let a = ['a','b'];
// let b = ['c'];
// let c = ['d','e'];

// let d = a.concat(c,b);
// console.log(a);
// console.log(b);
// console.log(d);
// console.log([...a,...b,...c]);

// const [a,...b] = [1,2,3]
// console.log(b);//[2,3]

// const [a,...b] = ['123']
// console.log(a);//123
// console.log(b);//[]

// let a = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]
// const b = new Set([...a])
// console.log(...b);//1 2 3 ...29 30
// console.log(...a);//1 2 3 ...29 30

// const arr = [1, 2, 3, 4, 1, 2, 3, 4, 5,6]
// const arr2 = new Set([...arr] )
// console.log(arr2);         // Set { 1, 2, 3, 4, 5, 6 }
// console.log(arr2.has(1));  // true
// console.log(...arr2);      // 1 2 3 4 5 6
// console.log([...arr2]);    // [ 1, 2, 3, 4, 5, 6 ]

// class polygon{
//     constructor(hight, width){
//         this.hight = hight;
//         this.width = width;
//     }
//     calcArea(){
//         return this.hight*this.width
//     }
//     get area(){
//         return this.calcArea();
//     }
// }
// const a = new polygon(10,10);
// console.log(a); //polygon { hight: 10, width: 10 }
// console.log(a.area);//100
// console.log(a.calcArea());//100


// class polygon{
//     constructor(hight, width){
//         this.hight = hight;
//         this.width = width;
//     }
//     static calcArea(){
//         return this.hight*this.width
//     }
// }
// const a = new polygon(10,10);
// console.log(a); //polygon { hight: 10, width: 10 }
// console.log(polygon.calcArea());//100


// class Point {
//     constructor(x, y) {
//         this.x = x;
//         this.y = y;
//     }
//     static distance(a, b) {
//         const dx = a.x - b.x;
//         const dy = a.y - b.y;
//         return Math.sqrt(dx*dx + dy*dy);
//     }
// }
// const p1 = new Point(5, 5);
// const p2 = new Point(10, 10);
// console.log(Point!!!.distance(p1, p2)); // !!!

// class animal{
//     constructor(name){
//         this.name = name;
//     }
//     speak(){
//         console.log(this.name + '123');
//     }
// }
// class cat extends animal{
//     speak(){
//         console.log(this.name+'456');
//     }
// }
// const a = new cat("788")
// a.speak()

// class Cat {
//     constructor(name) {
//       this.name = name;
//     }
//     speak() {
//       console.log(this.name + '123');
//     }
//   }
//   class Lion extends Cat {
//     speak() {
//       super.speak();
//       console.log(this.name + '456');
//     }
//   }
//   var l = new Lion('Fuzzy');
//   l.speak();//Fuzzy123
//             //Fuzzy456

// const i =new class{
//     constructor(name){
//         this.name = name;
//     }
//     speak(){
//         console.log(this.name + '456');
//         console.log(this);//{ name: '123' }
//     }
// }('123')
// i.speak();//123456
