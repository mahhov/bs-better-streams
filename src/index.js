const Stream = require('./Stream');

let stream = value => new Stream(value);

module.exports = stream;
