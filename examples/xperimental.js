const st = require('../src/index');

let stream = st([1, 2, 3]);

stream.each(x => console.log(x));

console.log('hi');
