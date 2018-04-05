const Stream = require('../src/Stream');

let myStream = new Stream();

myStream.write(110, 10, 30, 130, 50, 150);
let ifStreams = myStream.if(value => value > 100);
console.log(ifStreams.then.outValues)
console.log(ifStreams.else.outValues)
