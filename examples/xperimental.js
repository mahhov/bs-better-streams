const Stream = require('../src/Stream');

let s = new Stream();

let out = s
    .map(x => x * 2)
    .map(x => x * 2);

s.write(10);
s.write(11);
s.write(12);

let out2 = s.map(x => x + 3);
let out3 = out.map(x => x + 5);
//
// console.log(out.outValues);
// console.log(out2.outValues);
// console.log(out3.outValues);


let myStream = new Stream();
let promise1 = Promise.resolve('i hate `.then`s');
let promise2 = Promise.reject('rejections r ignored');
myStream.writePromise(promise1, promise2);

setTimeout(() => {
    console.log(myStream.outValues);
}, 100);
// console.log(myStream.outValues);
