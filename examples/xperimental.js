const Stream = require('../src/Stream');

let myStream = new Stream();
let otherStream = new Stream();

myStream.productX(otherStream, ({myId}) => myId, ({otherId}) => otherId, (left, right) => {
    left.paired = true;
});
myStream.write({myId: 1, myValue: 100});
myStream.write({myId: 2, myValue: 200});
myStream.write({myId: 2, myValue: 201});
otherStream.write({otherId: 2, otherValue: 20});
otherStream.write({otherId: 2, otherValue: 21});
otherStream.write({otherId: 3, otherValue: 30});

console.log(myStream.outValues);

[{myId: 1, myValue: 100},
    {myId: 2, myValue: 200, paired: true},
    {myId: 2, myValue: 201, paired: true}]
