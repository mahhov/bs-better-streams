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

let productStream = myStream.productX(otherStream, (left, right) => left.myId === right.otherId, (left, right) => {
    left.paired = true;
    right.paired = true;
    return {sum: left.myValue + right.otherValue};
});
myStream.write({myId: 1, myValue: 100});
myStream.write({myId: 2, myValue: 200});
myStream.write({myId: 2, myValue: 201});
otherStream.write({otherId: 2, otherValue: 20});
otherStream.write({otherId: 2, otherValue: 21});
otherStream.write({otherId: 3, otherValue: 30});

console.log(myStream.outValues)
console.log(otherStream.outValues)
console.log(productStream.outValues)