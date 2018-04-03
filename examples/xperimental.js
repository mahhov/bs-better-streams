const Stream = require('../src/Stream');

let s = new Stream();

let out = s
    .map(x => x * 2)
    .map(x => x * 2);

s.write(10);
s.write(11);
s.write(12);

let out2 = s.map(x => x + 3);
let out3 = out.map(x => x + 5);

console.log(out.outValues);
console.log(out2.outValues);
console.log(out3.outValues);
