const Stream = require('../src/Stream');

let myStream = new Stream();

let outStream = myStream.branchMap(
    a => a[0] === 'a', a => 'Apple ' + a,
    a => a[0] === 'b', a => 'Banana ' + a,
    a => 'Other ' + a);
myStream.write('at', 'bat', 'action', 'cat', 'aaa');
console.log(outStream.outValues);

['Apple at', 'Banana bat', 'Apple action', 'Other cat', 'Apple aaa']