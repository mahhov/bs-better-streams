const Stream = require('../src/Stream');

let myStream = new Stream();

myStream.write(110, 10, 30, 130, 50, 150);

let promiseify = value => 
    new Promise(resolve => {setTimeout (resolve(value)) });

myStream.rate
