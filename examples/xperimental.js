const Stream = require('../src/Stream');

let myStream = new Stream();

let outStream = myStream.set('sum', (object, index) =>  object.number + object.otherNumber + index );
myStream.write({number: 5, otherNumber: 10});
console.log(outStream.outValues);
// outStream.outValues equals [15]
