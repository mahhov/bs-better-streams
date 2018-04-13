const Stream = require('../src/Stream');

let myStream = new Stream();

myStream.write(1, 2, 3, 4, 5);
let throttled = myStream.throttle(2);
console.log(throttled.stream.outValues, 'equals', [1, 2]);
throttled.unthrottle();
console.log(throttled.stream.outValues, 'equals', [1, 2, 3, 4, 5]);
myStream.write(6, 7);
console.log(throttled.stream.outValues, 'equals', [1, 2, 3, 4, 5, 6, 7]);
