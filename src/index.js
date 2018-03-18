const Stream = require('./Stream');

const _ = require('./');

let stream = list => new Stream(list);

module.exports = stream;
