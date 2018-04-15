const Stream = require('../src/Stream');

// let animals = new Stream();
//
// animals.write({type: 'cat', 'class': 'mammalia', names: ['kitty', 'cupcake']});
// animals.write({type: 'dog', 'class': 'mammalia', names: ['barf', 'brownNose']});
//
// animals
//     .flatMap(animalType =>
//         animalType.names.map(name => {
//             let animal = Object.assign({}, animalType);
//             animal.name = name;
//             delete animal.names;
//             return animal;
//         }))
//     .each(console.log);
//
// animals
//     .flattenOn('names', 'name')
//     .each(console.log);


myStream = new Stream();

myStream.write({key1: 'value1', numbers: [1, 2]});
myStream.write({key1: 'value1b', numbers: [4, 5]});
let outStream = myStream.flattenOn('numbers', 'number');
console.log(outStream.outValues);


[{key1: 'value1', number: 1}, {key1: 'value1', number: 2}, {key1: 'value1b', number: 4}, {key1: 'value1b', number: 5}]
