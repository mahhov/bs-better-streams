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

### write

`myStream.write(10, 20, 30);`

### writeArray

`myStream.write([10, 20, 30]);`

### each

`myStream.each( (value, index) => doOperation(value, index) );`

### map

`myStream.map( (value, index) => value * index );`

### filter

`myStream.filter( (value, index) => value > index );`

### filterCount

```js
let outStream = myStream.filterCount(3);
myStream.write('first', 'second', 'third', 'fourth', 'fifth');
// outStream.outValues equals [first, second, third]
```

### filterIndex

```js
let outStream = myStream.filterIndex([0, 2, 3]);
myStream.write('first', 'second', 'third', 'fourth', 'fifth');
// outStream.outValues equals [first, third, fourth]
```

### pluck

```js
let outStream = myStream.filter('key');
myStream.write({key: 'value'});
// outStream.outValues equals ['value']
```

### set

```js
let outStream = myStream.set('sum', (object, index) =>  object.number + object.otherNumber + index );
myStream.write({number: 5, otherNumber: 10});
// outStream.outValues equals [15]
```

### repeat

```js
let outStream = myStream.repeat( (value, index) =>  value + index );
myStream.write(2, 3, 2);
// outStream.outValues equals [2, 2, 3, 3, 3, 3, 2, 2, 2, 2]
```

### repeatCount

```js
let outStream = myStream.repeatCount(2);
myStream.write(2, 3, 2);
// outStream.outValues equals [2, 2, 3, 3, 2, 2]
```

### flatten

```js
let outStream = myStream.flatten(2);
myStream.write([2], [3], [2, 4]);
// outStream.outValues equals [2, 3, 2, 4]
```
