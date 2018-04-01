const Stream = require('../src/Stream');

let s = new Stream();

let s1 = s.each((value, index) => {
    console.log('value', value);
}).each((value, index) => {
    console.log('index', index);
});

let s2 = s.each((value, index) => {
    console.log('value + index', value, index);
});

s.write(10);
s.write(11);
s.write(12);

console.log(s.length);
console.log(s1.length);
console.log(s2.length);
