const StreamIf = require('./StreamIf');

class Stream {
    constructor(value) {
        this.value = value;
    }

    each(handler) {
    }

    map(handler) {
    }

    filter(handler) {
    }

    //
    // set(field, func) {
    //     return this.each((elem, ...args) => {
    //         elem[field] = func(elem, ...args);
    //     });
    // }
    //
    // repeat(count) {
    //     return this.map(elem => _.times(count, () => elem));
    // }
    //
    // field(name) {
    //     return new B_(this.value[name]);
    // }
    //
    // asList(func) {
    //     return func(this.value);
    // }
    //
    // if(predicate) {
    //     return new B_If(this, predicate);
    // }
    //
    // asPromise() {
    //
    // }
    //
    // unwrap() {
    //     return this.value;
    // }
    //
    // get length() {
    //     return this.value && this.value.length;
    // }
}

module.exports = Stream;
