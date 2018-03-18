# bs-better-stream

## Setup

`npm i -save bs-better-stream`

`const s = require('bs-better-stream');`

## Overview

### Given

```
const stream = require('../src/index');

let dog = {
    size: 3,
    sound: 'bark',
    planet: 'earth',
    description: 'smelly'
};

let cat = {
    size: 3,
    sound: 'purr',
    planet: 'earth',
    description: 'tasty'
};

let joojoo = {
    size: 8,
    sound: 'joououooouuuiiuuouo',
    planet: 'Jupiter',
    description: 'superior being',
};

let animals = [dog, cat, joojoo];
```

### Then

```
stream(animals)
    .if(animal => animal.planet === 'earth')
    .then(earthAnimals => earthAnimals
        .set('safe', () => true))
    .else(nonEarthAnimals => nonEarthAnimals
        .set('safe', animal => animal.size < 6));
```

### Results in

```
[
    {
        "size": 3,
        "sound": "bark",
        "planet": "earth",
        "description": "smelly",
        "safe": true
    },
    {
        "size": 3,
        "sound": "purr",
        "planet": "earth",
        "description": "tasty",
        "safe": true
    },
    {
        "size": 8,
        "sound": "joououooouuuiiuuouo",
        "planet": "Jupiter",
        "description": "superior being",
        "safe": false
    }
]
```

## methods

stream(value)

length

value

union(stream)

each(handler)

map(handler)

filter(handler)

pluck(name)

set(field, handler)

repeat(count)

asList(handler)

if(predicate)

then(handler)

elseIf(predicate)

else(handler)

done()
