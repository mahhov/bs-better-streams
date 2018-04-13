const Stream = require('../src/Stream');

let myStream = new Stream();
let myStream2 = new Stream();


let outStream = myStream.join(myStream2);

myStream.write(1, 2);

myStream2.write(5, 6);

myStream.write(7)

let ifStreams = outStream.if((x) => x < 5)

console.log('true', ifStreams.then.outValues)
console.log('false', ifStreams.else.outValues)

