const Stream = require('../src/Stream');

let makePromise = () => {
    let res, rej;
    let promise = new Promise((resolve, reject) => {
        res = resolve;
        rej = reject;
    });
    promise.resolve = res;
    promise.reject = rej;
    return promise;
};

let myStream = new Stream();
let otherStream = new Stream();

myStream.write({key1: 'value1', key2: Promise.resolve('value2')});
myStream.write({key1: 'value2', key2: Promise.reject('rejectValue2')});
let outStream = myStream.waitOn('key2', true);
// outStream.outValues equals [{key1: 'value1', key2: 'value2'}]

setTimeout(() =>
        console.log(outStream.outValues)
    , 100);