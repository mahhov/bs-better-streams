const Stream = require('../src/Stream');

let myStream = new Stream();

let promise1 = Promise.resolve(1);
let promise2 = Promise.resolve(2);
let promise3 = Promise.resolve(3);

myStream.write(promise1, promise2, promise3);

let x = myStream.wait();

setTimeout(() => {
    console.log(x.outValues);
}, 100);
