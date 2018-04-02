const Stream = require('../src/Stream');

let s = new Stream();

s
    .map(x => x * 2)
    .each(x => console.log(x))
    .map(x => x * 2)
    .each(x => console.log(x))

s.write(10);
s.write(11);
s.write(12);

console.log(s.length);
