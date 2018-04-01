const Stream = require('../src/Stream');

let s = new Stream();

s.each((value, index) => {
    console.log('value', value);
}).each((value, index) => {
    console.log('index', index);
});

s.each((value, index) => {
    console.log('value + index', value, index);
});

s.write(10);
s.write(11);
s.write(12);
