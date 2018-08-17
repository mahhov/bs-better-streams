const Stream = require('../src/Stream');

let myStream = new Stream();

let outStream = myStream.omit('gender', 'weight');
myStream.write({
    name: 'myName',
    age: 'myAge',
    gender: 'myGender',
    weight: 'myWeight'
});
// outStream.outValues equals [{name: 'myName', age: 'myAge'}]

console.log(outStream.outValues);
