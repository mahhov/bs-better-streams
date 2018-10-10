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

myStream.write(1, 2);

otherStream.write(1, 2);

myStream.productX(otherStream, (a, b) => console.log(a, b), () => 0);

myStream.write(3);
otherStream.write(3);
myStream.write(4);
otherStream.write(4);
