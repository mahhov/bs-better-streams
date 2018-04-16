const Stream = require('../src/Stream');

let myStream = new Stream();
let otherStream = new Stream();

let productStream = myStream.product(otherStream, 'myId', 'otherId', 'other');
myStream.write({myId: 1, myValue: 100});
myStream.write({myId: 2, myValue: 200});
myStream.write({myId: 2, myValue: 201});
otherStream.write({otherId: 2, otherValue: 20});
otherStream.write({otherId: 2, otherValue: 21});
otherStream.write({otherId: 3, otherValue: 30});

console.log(productStream.outValues);

[{myId: 2, myValue: 200, other: {otherId: 2, otherValue: 20}},
    {myId: 2, myValue: 201, other: {otherId: 2, otherValue: 20}},
    {myId: 2, myValue: 200, other: {otherId: 2, otherValue: 21}},
    {myId: 2, myValue: 201, other: {otherId: 2, otherValue: 21}}]
