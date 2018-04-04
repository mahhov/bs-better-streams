const Stream = require('../src/Stream');

let myStream = new Stream();

myStream.write(Promise.resolve('stream'));
myStream.write(Promise.resolve('async'));
myStream.write(Promise.resolve('data'));
myStream.write(Promise.reject('rejected'));
let otherStream = myStream.wait();
myStream.write(Promise.resolve('without needing'));
myStream.write(Promise.resolve('async/await'));
myStream.write(Promise.resolve('or .then'));
// otherStream.outValues equals ['stream', 'async', 'data', 'without needing', 'async/await', 'or .then']

setTimeout(() => {
    console.log(otherStream.outValues);
}, 100);
