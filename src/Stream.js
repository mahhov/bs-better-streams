const StreamIf = require('./StreamIf');

class Stream {
    constructor(value) {
        this.value = value;
    }

    each(handler) {
        this.value.forEach(handler);
        return this;
    }

    map(handler) {
        return new Stream(this.value.map(handler));
    }

    filter(handler) {
        return new Stream(this.value.filter(handler));
    }

    pluck(name) {
        return this.map(elem => elem[name]);
    }

    set(field, handler) {
        return this.each((elem, ...args) => {
            elem[field] = handler(elem, ...args);
        });
    }

    repeat(count) {
        let repeated = [];
        this.each(elem => {
            for (let i = 0; i < count; i++)
                repeated.push(elem)
        });
        return new Stream(repeated);
    }

    asList(handler) {
        return new Stream(handler(this.value));
    }

    // if(predicate) {
    //     return new B_If(this, predicate);
    // }
    //
    // asPromise() {
    //
    // }
    //
    get length() {
        return this.value.length;
    }
}

module.exports = Stream;
