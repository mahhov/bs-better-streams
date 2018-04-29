const Stream = require('../src/Stream');

let myStream = new Stream();
let otherStream = new Stream();


let outStream = myStream.unique();
myStream.write(0, 1, 1, 0, 2, 3, 2, 3);
// outStream.outValues equals [0, 1, 2, 3]
console.log(outStream.outValues);

console.log(myStream.outValues);
