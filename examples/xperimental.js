const Stream = require('../src/Stream');

let myStream = new Stream();

let outStream = myStream.switchMap(a => a.type,
    'animal', a => `i have a pet ${a.value}`,
    'number', a => `u have ${a.value} pencils`,
    'color', a => `his favorite color is ${a.value}`);

myStream.write(
    {type: 'animal', value: 'elephant'},
    {type: 'animal', value: 'flamingo'},
    {type: 'number', value: 51},
    {type: 'number', value: 1235},
    {type: 'color', value: 'blue'},
    {type: 'color', value: 'pink'},
    {type: 'star', value: 'sun'});

console.log(outStream.outValues);