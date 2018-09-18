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

let p1 = makePromise();
let p2 = makePromise();

myStream.write(p1);
myStream.write(p2);

let myStreamWaited = myStream.wait();

p1.resolve(1);
p2.resolve(2);

myStream.promise.then(() => {
    console.log(myStreamWaited.outValues);
});