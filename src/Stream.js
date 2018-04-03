class Stream {
    constructor(writer) {
        this.outValues = [];
        this.inputCount = 0;
        this.next = [];
        this.writer = writer;
    }

    to(stream) {
        this.next.push(stream);
        this.outValues.forEach(value => {
            stream.write(value);
        });
        return stream
    }

    write(...values) {
        values.forEach(value => {
            let outValues = typeof this.writer === 'function' ? this.writer(value, this.inputCount++) : [value];
            outValues.forEach(outValue => {
                this.next.forEach(nextStream => {
                    nextStream.write(outValue);
                });
                this.outValues.push(outValue);
            });
        });
    }

    writePromise(...promises) {
        promises.forEach(promise => {
            promise.then(value => {
                this.write(value);
            }).catch(() => {
            });
        });
    }

    each(handler) {
        return this.to(new Stream((value, index) => {
            handler(value, index);
            return [value];
        }));
    }

    map(handler) {
        return this.to(new Stream((value, index) => [handler(value, index)]));
    }

    filter(handler) {
        return this.to(new Stream((value, index) => handler(value, index) ? [value] : []));
    }

    filterCount(count) {
        return this.filter((value, index) => index < count);
    }

    filterIndex(indexes) {
        return this.filter((value, index) => indexes.includes(index));
    }

    pluck(name) {
        return this.to(new Stream(value => [value[name]]));
    }

    set(name, handler) {
        return this.to(new Stream((value, index) => {
            value[name] = handler(value, index);
            return [value];
        }));
    }

    repeat(handler) {
        return this.to(new Stream((value, index) => {
            let count = handler(value, index);
            return Array(count).fill(value)
        }));
    }

    repeatCount(count) {
        return this.to(new Stream((value, index) => Array(count).fill(value)));
    }

    flatten() {
        return this.to(new Stream(value => value));
    }

    join(stream) {
        return stream.to(this.to(new Stream()));
    }

    get length() {
        return this.outValues.length; // inputCount?
    }
}

module.exports = Stream;

// todo
// if
// then
// elseif
// endif
// for n
// for iterate
// on
// stopon
// generating
// while/until loops
// group by index
// group by n
// group by predicate
