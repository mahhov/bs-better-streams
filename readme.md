# bs-better-stream

## Setup

`npm i -save bs-better-stream`

`const stream = require('bs-better-stream');`

```js
let myStream = stream();
myStream.write(10, 20, 30);
myStream.each(console.log);
myStream.write(11, 21, 31);
```

## Overview

### chaining

```js
myStream
    .write(10, 20, 30)
    .each(print)
    .map(double)
    .filter(greaterThan30)
    .write(-1, -2, -3)
    .writePromise(requestAsyncNumber());
```

### accumulation

you can use streams before and after you have began writing to them

```js
let myStream = stream();
myStream.write(11, 21, 31);
myStream.each(console.log);
myStream.write(12, 22, 32);
// will print 11, 21, 31, 12, 22, 32
```

### write (...values)

`myStream.write(10, 20, 30);`

### write array (...[array of values])

`myStream.write(...[10, 20, 30]);`

### write promise (...promises)

```js
let promise1 = Promise.resolve('i hate `.then`s');
let promise2 = Promise.reject('rejections r ignored');
myStream.writePromise(promise1, promise2);
// myStream.outValues equals [10]
```

### each (handler)

`myStream.each( (value, index) => doOperation(value, index) );`

### map (handler)

`myStream.map( (value, index) => value * index );`

### filter (predicateHandler)

`myStream.filter( (value, index) => value > index );`

### filterCount (integer)

```js
let outStream = myStream.filterCount(3);
myStream.write('first', 'second', 'third', 'fourth', 'fifth');
// outStream.outValues equals [first, second, third]
```

### filterIndex ([array of indices])

```js
let outStream = myStream.filterIndex([0, 2, 3]);
myStream.write('first', 'second', 'third', 'fourth', 'fifth');
// outStream.outValues equals [first, third, fourth]
```

### filterMap (predicateHandler, truePredicateHandler, falsePredicateHandler)

```js
let outStream = myStream.filterMap(value => value > 100, a => a + 100, a => -a);
myStream.write(200, 0, 1, 201, 2, 202);
// outStream.outValues equals [300, -0, -1, 301, -2, 302]
```

### branchMap (...predicate and map handlers)

```js
let myStream = new Stream();
let outStream = myStream.branchMap(
    a => a[0] === 'a', a => 'Apple ' + a, // if item starts with 'a', prepend 'Apple'
    a => a[0] === 'b', a => 'Banana ' + a); // if item starts with 'b', prepend 'Banana'
myStream.write('at', 'bat', 'action', 'cat', 'aaa');
// outStream.outValues equals ['Apple at', 'Banana bat', 'Apple action', 'cat', 'Apple aaa']
```

```js
let myStream = new Stream();
let outStream = myStream.branchMap(
    a => a[0] === 'a', a => 'Apple ' + a, // if item starts with 'a', prepend 'Apple'
    a => a[0] === 'b', a => 'Banana ' + a, // if item starts with 'b', prepend 'Banana'
    a => 'Other ' + a); // else, prepend, 'Other'
myStream.write('at', 'bat', 'action', 'cat', 'aaa');
// outStream.outValues equals ['Apple at', 'Banana bat', 'Apple action', 'Other cat', 'Apple aaa']
```

### switchMap (switchHandler, ...case and map handlers)

```js
let myStream = new Stream();
let outStream = myStream.switchMap(
    a => a.type,
    'animal', a => `i have a pet ${a.value}`,
    'number', a => `u have ${a.value} pencils`,
    'color', a => `his favorite color is ${a.value}`,
    a => `other: ${a.value}`);
myStream.write(
    {type: 'animal', value: 'elephant'},
    {type: 'animal', value: 'flamingo'},
    {type: 'number', value: 51},
    {type: 'number', value: 1235},
    {type: 'color', value: 'blue'},
    {type: 'color', value: 'pink'},
    {type: 'star', value: 'sun'});
/*
[ 'i have a pet elephant',
  'i have a pet flamingo',
  'u have 51 pencils',
  'u have 1235 pencils',
  'his favorite color is blue',
  'his favorite color is pink',
  'other: sun' ]
*/
```

```js
let myStream = new Stream();
let outStream = myStream.switchMap(
    a => a.type,
    'animal', a => `i have a pet ${a.value}`,
    'number', a => `u have ${a.value} pencils`,
    'color', a => `his favorite color is ${a.value}`,
    a => `other: ${a.value}`);
myStream.write(
    {type: 'animal', value: 'elephant'},
    {type: 'animal', value: 'flamingo'},
    {type: 'number', value: 51},
    {type: 'number', value: 1235},
    {type: 'color', value: 'blue'},
    {type: 'color', value: 'pink'},
    {type: 'star', value: 'sun'});
/*
[ 'i have a pet elephant',
  'i have a pet flamingo',
  'u have 51 pencils',
  'u have 1235 pencils',
  'his favorite color is blue',
  'his favorite color is pink',
  { type: 'star', value: 'sun' } ]
*/
```

### unique ()

```js
let outStream = myStream.unique();
myStream.write(0, 1, 1, 0, 2, 3, 2, 3);
// outStream.outValues equals [0, 1, 2, 3]
```

### uniqueOn (keyName)

```js
let outStream = myStream.uniqueOn('name');
myStream.write(
    {age: 4231, name: 'Odysseus'},
    {age: 4250, name: 'Odysseus'},
    {age: 4234, name: 'Helen'});
// outStream.outValues equals [{age: 4231, name: 'Odysseus'},
//                             {age: 4234, name: 'Helen'}]
```

### uniqueX (handler)

```js
let outStream = myStream.uniqueX(obj => obj.a + obj.b);
myStream.write(
    {a: 1, b: 5},
    {a: 2, b: 4},
    {a: 3, b: 3});
// outStream.outValues equals [{a: 1, b: 5}]
```

### pluck (keyName)

```js
let outStream = myStream.pluck('key');
myStream.write({key: 'value'});
// outStream.outValues equals ['value']
```

### wrap (keyName)

```js
let outStream = myStream.wrap('key');
myStream.write('value');
// outStream.outValues equals [{key: 'value'}]
```

### pick (...keyNames)

```js
let outStream = myStream.pick('name', 'age');
myStream.write({
    name: 'myName',
    age: 'myAge',
    gender: 'myGender',
    weight: 'myWeight'
});
// outStream.outValues equals [{name: 'myName', age: 'myAge'}]
```

### omit (...keyNames)

```js
let outStream = myStream.omit('gender', 'weight');
myStream.write({
    name: 'myName',
    age: 'myAge',
    gender: 'myGender',
    weight: 'myWeight'
});
// outStream.outValues equals [{name: 'myName', age: 'myAge'}]
```

### set (keyName, handler)

```js
let outStream = myStream.set('sum', (object, index) =>  object.number + object.otherNumber + index );
myStream.write({number: 5, otherNumber: 10});
// outStream.outValues equals [ { number: 5, otherNumber: 10, sum: 15 } ]
```

### repeat (handler)

```js
let outStream = myStream.repeat( (value, index) =>  value + index );
myStream.write(2, 3, 2);
// outStream.outValues equals [2, 2, 3, 3, 3, 3, 2, 2, 2, 2]
```

### repeatCount (integer)

```js
let outStream = myStream.repeatCount(2);
myStream.write(2, 3, 2);
// outStream.outValues equals [2, 2, 3, 3, 2, 2]
```

### flatten ()

```js
let outStream = myStream.flatten();
myStream.write([2], [3], [2, 4]);
// outStream.outValues equals [2, 3, 2, 4]
```

### flattenOn (listKeyName, newKeyName)

```js
myStream.write({key1: 'value1', numbers: [1, 2]});
myStream.write({key1: 'value1b', numbers: [4, 5]});
let outStream = myStream.flattenOn('numbers', 'number');
// outStream.outValues equals [{key1: 'value1', number: 1}, {key1: 'value1', number: 2}, {key1: 'value1b', number: 4}, {key1: 'value1b', number: 5}]
```

#### Why is flattenOn useful?

imagine we have a set of animals grouped by species

```js
let animalSpecies = new Stream();
animalSpecies.write({species: 'cat', class: 'mammalia', names: ['kitty', 'cupcake']});
animalSpecies.write({species: 'dog', class: 'mammalia', names: ['barf', 'brownNose']});
```

without `flattenOn`, we would need to do something like the following in order to obtain a flat list of animals

```js
animalSpecies
    .flatMap(animalSpecies =>
        animalSpecies.names.map(name => {
            let animal = Object.assign({}, animalSpecies);
            delete animal.names;
            animal.name = name;
            return animal;
        }));
```

but with `flattenOn`, we can simply do the following

```js
animalSpecies
    .flattenOn('names', 'name');
```

### join (stream)

```js
let outStream = myStream.join(otherStream);
myStream.write(1, 2);
otherStream.write(3, 4);
myStream.write(5, 6);
// outStream.outValues equals [1, 2, 3, 4, 5, 6]
```

### product (rightStream, leftStreamIdKey, rightStreamIdKey, leftStreamSetKey)

```js
let productStream = myStream.product(otherStream, 'myId', 'otherId', 'other');
myStream.write({myId: 1, myValue: 100});
myStream.write({myId: 2, myValue: 200});
myStream.write({myId: 2, myValue: 201});
otherStream.write({otherId: 2, otherValue: 20});
otherStream.write({otherId: 2, otherValue: 21});
otherStream.write({otherId: 3, otherValue: 30});
// productStream.outValues equals [{myId: 2, myValue: 200, other: {otherId: 2, otherValue: 20}},
//                                 {myId: 2, myValue: 201, other: {otherId: 2, otherValue: 20}},
//                                 {myId: 2, myValue: 200, other: {otherId: 2, otherValue: 21}},
//                                 {myId: 2, myValue: 201, other: {otherId: 2, otherValue: 21}}]
```

### productX (rightStream, matchHandler, handler)

```js
let productStream = myStream.productX(otherStream, (left, right) => left.myId === right.otherId, (left, right) => {
    left.paired = true;
    right.paired = true;
    return {sum: left.myValue + right.otherValue};
});
myStream.write({myId: 1, myValue: 100});
myStream.write({myId: 2, myValue: 200});
myStream.write({myId: 2, myValue: 201});
otherStream.write({otherId: 2, otherValue: 20});
otherStream.write({otherId: 2, otherValue: 21});
otherStream.write({otherId: 3, otherValue: 30});
// myStream.outValues equals [{myId: 1, myValue: 100},
//                            {myId: 2, myValue: 200, paired: true},
//                            {myId: 2, myValue: 201, paired: true}]
// otherStream.outValues equals [{otherId: 2, otherValue: 20, paired: true},
//                               {otherId: 2, otherValue: 21, paired: true},
//                               {otherId: 3, otherValue: 30}]
// productStream.outValues equals [{sum: 220},
//                                 {sum: 221},
//                                 {sum: 221},
//                                 {sum: 222}]
```

Note that while `product` modifies a copy of left stream's values, leaving left stream unmodified; `productX` passes in the original values of left stream, allowing left stream to be modified by the handler as seen in the example above.

### to (stream)

```js
myStream.to(outStream);
myStream.write(1, 2);
outStream.write(3, 4);
// outStream.outValues equals [1, 2, 3, 4]
```

### wait ()

```js
myStream.write(Promise.resolve('stream'));
myStream.write(Promise.resolve('async'));
myStream.write(Promise.resolve('data'));
myStream.write(Promise.reject('rejected'));
let outStream = myStream.wait();
myStream.write(Promise.resolve('without needing'));
myStream.write(Promise.resolve('async/await'));
myStream.write(Promise.resolve('or .then'));
// outStream.outValues equals ['stream', 'async', 'data', 'without needing', 'async/await', 'or .then']
```

### waitOn (key)

```js
myStream.write({key1: 'value1', key2: Promise.resolve('value2')});
let outStream = myStream.waitOn('key2');
// outStream.outValues equals [{key1: 'value1', key2: 'value2'}]
```

#### Why is waitOn useful?

imagine we have a set of users

```js
let users = new Stream();
users.write({userId: '1', height: 3, color: 'blue'}, {userId: '2', height: 4, color: 'green'}, {userId: '3', height: 2, color: 'orange'});
```

and this api to obtain a user's shape

```js
let getUserShape = userId => {
    return Promise.resolve(userId === 1 ? 'circle' : 'square');
};
```

without `waitOn`, we would need to do something like the following in order to include every user's shape

```js
users
    .set('shape', ({userId}) => getUserShape(userId))
    .map(user => user.shape.then(shape => {
        user.shape = shape;
        return user;
    }))
    .wait();
```

but with `waitOn`, we can simply do the following

```js
users
    .set('shape', ({userId}) => getUserShape(userId))
    .waitOn('shape');
```

### waitOrdered ()

```js
let resolve1, resolve2;
let promise1 = new Promise(resolve => resolve1 = resolve);
let promise2 = new Promise(resolve => resolve2 = resolve);
myStream.write(promise1, promise2);
let outStream = myStream.waitOrdered();
resolve2('promise 2 resolved first');
resolve1('promise 1 resolved last');
// outStream.outValues equals ['promise 1 resolved last', 'promise 2 resolved first']
```

### waitOnOrdered (key)

```js
let resolve1, resolve2;
let promise1 = new Promise(resolve => resolve1 = resolve);
let promise2 = new Promise(resolve => resolve2 = resolve);
myStream.write({key: promise1}, {key: promise2});
let outStream = myStream.waitOnOrdered('key');
resolve2('promise 2 resolved first');
resolve1('promise 1 resolved last');
// outStream.outValues equals [{key: 'promise 1 resolved last', key: 'promise 2 resolved first'}]
```

### if (predicateHandler)

```js
myStream.write(110, 10, 30, 130, 50, 150);
let ifStreams = myStream.if(value => value > 100);
// ifStreams.then.outValues equals [110, 130, 150]
// ifStreams.else.outValues equals [10, 30, 50]

console.log('numbers over 100:');
ifStreams.then.each(value => console.log(value));
console.log('numbers under 100:');
ifStreams.else.each(value => console.log(value));
```

### split (predicateHandler, truePredicateHandler, falsePredicateHandler)

```
myStream.write({species: 'kitten', name: 'tickleMe'});
myStream.write({species: 'kitten', name: 'pokeMe'});
myStream.write({species: 'puppy', name: 'hugMe'});
myStream.split(
	animal => animal.species === 'kitten',
	kittenStream => kittenStream
		.set('sound', () => 'meow')
		.set('image', ({name}) => getRandomLolzCatImage(name)),
	puppyStream => puppyStream
		.set('sound', () => 'wuff')
		.set('edible', () => true)
		.each(dipInChocolate));
```

### group (handler)

```js
myStream.write({species: 'cat', name: 'blue'}, {species: 'cat', name: 'green'}, {species: 'dog', name: 'orange'});
let species = myStream.group(animal => animal.species);
// species.cats.outValues equals [{species: 'cat', name: 'blue'}, {species: 'cat', name: 'green'}]
// species.dogs.outValues equals [{species: 'dog', name: 'orange'}]

console.log('cats:');
species.cat.each(cat => console.log('  ', cat.name));
console.log('dogs:');
species.dog.each(dog => console.log('  ', dog.name));
```

### groupCount (integerGroupSize)

```js
myStream.write(20, 30, 40, 50, 60, 70, 80);
let groupStreams = myStream.groupCount(3);
// groupStreams.group0.outValues equals [20, 30, 40]
// groupStreams.group1.outValues equals [50, 60, 70]
// groupStreams.group2.outValues equals [80]
```

### groupFirstCount (integerGroupSize)

```js
myStream.write(20, 30, 40, 50, 60, 70, 80);
let groupStreams = myStream.groupFirstCount(3);
// groupStreams.first.outValues equals [10, 20, 30]
// groupStreams.rest.outValues equals [50, 60, 70, 80]

console.log('first 3 numbers:');
groupStreams.first.each(number => console.log(number));
console.log('rest of numbers:');
groupStreams.rest.each(number => console.log(number));
```

### groupNCount (integerGroupSize, integerGroupCount)

```js
myStream.write(20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120);
let groupStreams = myStream.groupCount(3, 2);
// groupStreams.group0.outValues equals [20, 30, 40]
// groupStreams.group1.outValues equals [50, 60, 70]
// groupStreams.rest.outValues equals [80, 90, 100, 110, 120]
```

### groupIndex (...[lists of indices])

```js
myStream.write(0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100);
let groupStreams = myStream.groupIndex([0], [1, 3, 5, 6]);
// groupStreams[0].outValues equals [0]
// groupStreams[1].outValues equals [10, 30, 50, 60]
// groupStreams.rest.outValues equals [20, 40, 70, 80, 90, 100]

console.log('first number:');
groupStreams[0].each(number => console.log(number));
console.log('important numbers:');
groupStreams[1].each(number => console.log(number));
console.log('other numbers:');
groupStreams.rest.each(number => console.log(number));
```

### batch (integerBatchSize)

```js
myStream.write(0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100);
let outStream = myStream.batch(4);
// outStream.outValues equals [[0, 10, 20, 30], [40, 50, 60, 70]]
```

### batchFlat (integerBatchSize)

```js
let outStream = myStream.batchFlat(4);
myStream.write(0, 10, 20);
// outStream.outValues equals []
myStream.write(30, 40, 50);
// outStream.outValues equals [0, 10, 20, 30]
myStream.write(60, 70, 80);
// outStream.outValues equals [0, 10, 20, 30, 40, 50, 60, 70]
myStream.write(90, 100);
// outStream.outValues equals [0, 10, 20, 30, 40, 50, 60, 70]
```

### generate (handler)

```js
myStream.write(10, 40);
let outStream = myStream.generate(value => [value + 1, value * 2]);
// outStream.outValues equals [10, 11, 20, 40, 41, 80]
```

### flatMap (handler)

```js
myStream.write(10, 40);
let outStream = myStream.flatMap(value => [value + 1, value * 2]);
// outStream.outValues equals [11, 20, 41, 80]
```

### throttle (integer)

```js
myStream.write(promise1, promise2, promise3, promise4);
let throttled = myStream.throttle(2);
throttled.stream
    .wait()
    .each(doStuff)
    .each(throttled.nextOne);
```

After calling `throttled = stream.throttle(n)`, `throtled.stream` will emit `n` values initially. It will emit 1 more value each time `throttled.next()` or `throttled.nextOne()` are invoked, and `m` more values each time `throttled.next(m)` is invoked.

```js
myStream.write(1, 2, 3, 4, 5);
let throttled = myStream.throttle(2);
// throttled.stream.outValues equals [1, 2]
throttled.next(2);
// throttled.stream.outValues equals [1, 2, 3, 4]
throttled.next(2);
// throttled.stream.outValues equals [1, 2, 3, 4, 5]
myStream.write(6, 7);
// throttled.stream.outValues equals [1, 2, 3, 4, 5, 6]
```

Calling `throttled = stream.throttle()` is short for calling `throttled = stream.throttle(0)`, which results in a lazy stream. `throttled.stream` will emit values only when `throttled.next` is invoked.

```js
myStream.write(1, 2, 3, 4, 5);
let throttled = myStream.throttle(2);
// throttled.stream.outValues equals [1, 2]
throttled.unthrottle();
// throttled.stream.outValues equals [1, 2, 3, 4, 5]
myStream.write(6, 7);
// throttled.stream.outValues equals [1, 2, 3, 4, 5, 6, 7]
```

Calling `throttled.unthrottle()` will allow all current and future values to pass through without throttling, and rendering `throttled.next()` unnecessary.

### promise

`myStream.promise` returns a promise that resolves when all already written values to the stream have resolved.

```js
myStream.write(promise1, promise2, promise3, promise4);
myStream.promise.then(resolve1234 => process(resolve1234));
```

### length

`myStream.length`

### outValues

`myStream.outValues`
