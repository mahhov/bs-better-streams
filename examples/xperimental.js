const Stream = require('../src/Stream');

// let myStream = new Stream();
//
// myStream.write(10, 20, 30);
//
// let x = myStream
//     .map(a => a * 2)
//     .each(a => console.log('>', a))
//     .write(-1, -2, -3, 100)
//     .filter(a => a > 30)
//     .map(a => a + 1)
//     .each(a => console.log('>>', a));
//
// console.log(myStream.outValues);
// console.log(x.outValues);
//
// console.log('====');

// let scores = new Stream();
// let percentScores = scores.map(a => a / 50);
// let goodScores = percentScores.filter(a => a > .8);
//
// scores.write(34, 48);
// percentScores.write(.82);
//
// console.log('scores', scores.outValues);
// console.log('percentScores', percentScores.outValues);
// console.log('goodScores', goodScores.outValues);


let goodScores = new Stream().map(a => a / 50).filter(a => a > .8);
goodScores.write(.5);
console.log('goodScores', goodScores.outValues);
