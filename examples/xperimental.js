const Stream = require('../src/Stream');

let myStream = new Stream();

let outStream = myStream.batchFlat(4);
myStream.write(0, 10, 20);
console.log(outStream.outValues)
// outStream.outValues equals []
myStream.write(30, 40, 50);
console.log(outStream.outValues)
// outStream.outValues equals [0, 10, 20, 30]
myStream.write(60, 70, 80);
console.log(outStream.outValues)
// outStream.outValues equals [0, 10, 20, 30, 40, 50, 60, 70]
myStream.write(90, 100);
console.log(outStream.outValues)
// outStream.outValues equals [0, 10, 20, 30, 40, 50, 60, 70]
