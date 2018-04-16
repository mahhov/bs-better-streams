const Stream = require('../src/Stream');

// let stream1 = new Stream();
// let stream2 = new Stream();
//
// let p = stream1
//     .product(stream2, 'id', 'id', 'match');
//
// stream1.write({id: 1, value: 3});
// stream1.write({id: 2, value: 6});
// stream1.write({id: 3, value: 9});
//
// stream2.write({id: 1, value: 10});
// stream2.write({id: 2, value: 20});
// stream2.write({id: 4, value: 40});
//
// console.log(p.outValues);


let myStream = new Stream();
let otherStream = new Stream();

let productStream = myStream.product(otherStream, 'myId', 'otherId', 'other');
myStream.write({myId: 1, myValue: 10}, {myId: 2, myValue: 20});
otherStream.write({otherId: 1, otherValue: 100}, {otherId: 3, otherValue: 300});
// productStream.outValues equals [{myId: 1, myValue: 10, other: {otherId: 1, otherValue: 100}}, {myId: 2, myValue: 20}]
