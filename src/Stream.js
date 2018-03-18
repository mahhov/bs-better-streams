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

    if(predicate) {
        return new StreamIf(this, predicate);
    }

    // asPromise() {
    //
    // }

    get length() {
        return this.value.length;
    }
}

class StreamIf {
    constructor(stream, predicate) {
        let trues = [];
        let falses = [];
        stream.each((elem, ...args) => {
            (predicate(elem, ...args) ? trues : falses).push(elem);
        });
        this.thenValue = new Stream(trues);
        this.elseValue = new Stream(falses);
    }

    then(handler) {
        this.thenValue = handler(this.thenValue);
        return this;
    }

    else(handler) {
        this.elseValue = handler(this.elseValue);
        return this;
    }

    done() {
        return new Stream(this.thenValue.value.concat(this.elseValue.value));
    }
}

module.exports = Stream;
