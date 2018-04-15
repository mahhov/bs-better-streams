const Stream = require('../src/Stream');

let animalSpecies = new Stream();
animalSpecies.write({species: 'cat', 'class': 'mammalia', names: ['kitty', 'cupcake']});
animalSpecies.write({species: 'dog', 'class': 'mammalia', names: ['barf', 'brownNose']});

animalSpecies
    .flatMap(animalType =>
        animalType.names.map(name => {
            let animal = Object.assign({}, animalType);
            animal.name = name;
            delete animal.names;
            return animal;
        }));

animalSpecies
    .flattenOn('names', 'name');
