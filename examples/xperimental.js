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

myStream = new Stream()
myStream.write(1, 2, 3);
let oneToThree = myStream.map(a => a);
myStream.disconnect();
myStream.write(4, 5, 6);
let oneToSix = myStream.map(a => a);

console.log(myStream.outValues)
console.log(oneToSix.outValues)
console.log(oneToThree.outValues)
