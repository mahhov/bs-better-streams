const Stream = require('../src/Stream');

let myStream = new Stream();

let pc = () => {
    let resolve, reject;
    let promise = new Promise((resolv, rejec) => {
        resolve = resolv;
        reject = rejec;
    });
    return {promise, resolve, reject};
};

let waitStream = myStream.wait();
let pc1 = pc();
let pc2 = pc();
let pc3 = pc();
myStream.write(pc1.promise);
myStream.write(pc2.promise);
myStream.write(pc3.promise);

pc2.resolve(20)
pc3.resolve(30)
// pc1.resolve(10)

setTimeout(() => {
    console.log(waitStream.outValues);
}, 10);

