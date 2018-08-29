const Stream = require('../src/Stream');

let myStream = new Stream();

let resolve1, resolve2;
let promise1 = new Promise(resolve => resolve1 = resolve);
let promise2 = new Promise(resolve => resolve2 = resolve);
myStream.write({key: promise1}, {key: promise2});
let outStream = myStream.waitOnOrdered('key');
resolve2('promise 2 resolved first');

setTimeout(() => {
    resolve1('promise 1 resolved last');
}, 5);


setTimeout(() => {
    console.log(outStream.outValues);
}, 10);

