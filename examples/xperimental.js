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

stream(animals)
    .if(animal => animal.planet === 'earth')
    .then(earthAnimals => earthAnimals
        .set('safe', () => true))
    .else(nonEarthAnimals => nonEarthAnimals
        .set('safe', animal => animal.size < 6));

// [
//     {
//         "size": 3,
//         "sound": "bark",
//         "planet": "earth",
//         "description": "smelly",
//         "safe": true
//     },
//     {
//         "size": 3,
//         "sound": "purr",
//         "planet": "earth",
//         "description": "tasty",
//         "safe": true
//     },
//     {
//         "size": 8,
//         "sound": "joououooouuuiiuuouo",
//         "planet": "Jupiter",
//         "description": "superior being",
//         "safe": false
//     }
// ]
