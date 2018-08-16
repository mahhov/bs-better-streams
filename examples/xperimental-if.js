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


// syntax 1

myStream.absorb(110, 10, 30, 130, 50, 150);
let ifStreams = myStream.if(value => value > 100);

let outThen = ifStreams.then.map(value => value * 2);
let outElse = ifStreams.else.map(value => value * 3);
let out = outThen.join(outElse).map(value => value + 5);

console.log(out.outValues);


// syntax 2

myStream.absorb(110, 10, 30, 130, 50, 150);

let out = myStream
    .if(value => value > 100)
    .then(stream => stream
        .map(value => value * 2))
    .elseif(value => value === 100)
    .then(stream => stream
        .map(value => 1000))
    .else(stream => stream
        .map(value => value * 3))
    .done()
    .map(x => x + 5);

console.log(out.outValues);


// // syntax 3
//
// myStream.write(110, 10, 30, 130, 50, 150);
//
// let ifStreams = myStream.if(value => value > 100);
//
// ifStreams.then.map(value => value * 2);
// ifStreams.else.map(value => value * 3);
// let out = ifStreams.done.map(value => value + 5);
//
// console.log(out.outValues);
