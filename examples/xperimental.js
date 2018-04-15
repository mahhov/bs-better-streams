const Stream = require('../src/Stream');


// let getValue = key => {
//     return Promise.resolve(key + 10);
// };
//
// let s = new Stream();
//
// s.write(1, 2, 3, 4, 5);
//
// // s
// //     .map(key => ({key, value: getValue(key)}))
// //     .map(({key, value}) => value.then(value => ({key, value})))
// //     .wait()
// //     .each(console.log);
//
// s
//     .wrap('key')
//     .set('value', ({key}) => getValue(key))
//     .waitOn('value')
//     .each(console.log);
//

let myStream = new Stream();
myStream.write({key1: 'value1', key2: Promise.resolve('value2')});
let outStream = myStream.waitOn('key2');
// outStream.outValues equals [{key1: 'value1', key2: 'value2'}

setTimeout(() => {
    console.log(outStream.outValues);
}, 100);
