const Stream = require('../src/Stream');

let myStream = new Stream();

// myStream.write(1, 2, 3, 4, 5, 6);
// myStream
//     .if(num => num < 2)
//     .then(stream => stream
//         .map(num => num + 1))
//     .elseIf(num => num <= 3)
//     .then(stream => stream
//         .map(num => num + 5))
//     .elseIf(num => num > 0 && num < 4)
//     .then(stream => stream
//         .map(num => num - 2))
//     .else(stream => stream
//         .map(num => num - 8))
//     .done()
//     .map(num => num * 10);

// myStream.write(110, 10, 30, 130, 50, 150);
// let ifStreams = myStream.if(value => value > 100);
// ifStreams.then.each(value => console.log(value));
// ifStreams.else.each(value => console.log(value));
//
// myStream.write(110, 10, 30, 130, 50, 150);
// myStream.if(value => value > 100)
//     .then(stream => value => console.log(value))
//     .else(stream => value => console.log(value));
//
