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

let p = makePromise();

p.then(() => {
    throw 'e'
}).catch(() => console.log('ERROR'));

p.resolve(10);

// let main = async () => {
//     s = new Stream();
//     s.writePromise(Promise.resolve(3));
//     s.each((a, i) => console.log('x', i, a)); // remove
//
//     s.each(() => {
//         throw 'error';
//     });
//     // console.log('await', await s.promise);
//     // console.log('outvalues', s.outValues); // remove
// };
//
// main();
