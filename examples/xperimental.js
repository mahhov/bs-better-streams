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
//     // .wait('value')
//     .each(console.log);
//


let myStream = new Stream();
let outStream = myStream.wrap('key');
myStream.write('value');
// outStream.outValues equals [{key: 'value'}]
console.log(outStream.outValues);
