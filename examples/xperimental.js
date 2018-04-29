const Stream = require('../src/Stream');

let myStream = new Stream();

let resolve1, resolve2;
let promise1 = new Promise(resolve => resolve1 = resolve);
let promise2 = new Promise(resolve => resolve2 = resolve);
myStream.write(promise1, promise2);
let outStream = myStream.waitOrdered();
resolve2('promise 2 resolved first');
resolve1('promise 1 resolved last');

// ['promise 1 resolved last', 'promise 2 resolved first']

setTimeout(() => {
    console.log(outStream.outValues);
}, 10);
