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

    emit(outValue) {
        this.next.forEach(nextStream => {
            nextStream.write(outValue);
        });
        this.outValues.push(outValue);
    }

    write(...values) {
        values.forEach(value => {
            typeof this.writer === 'function' ? this.writer(value, this.inputCount++) : this.emit(value);
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
        return this.to(new Stream(function (value, index) {
            handler(value, index);
            this.emit(value);
        }));
    }

    map(handler) {
        return this.to(new Stream(function (value, index) {
            this.emit(handler(value, index));
        }));
    }

    filter(handler) {
        return this.to(new Stream(function (value, index) {
            handler(value, index) && this.emit(value)
        }));
    }

    filterCount(count) {
        return this.filter((value, index) => index < count);
    }

    filterIndex(indexes) {
        return this.filter((value, index) => indexes.includes(index));
    }

    pluck(name) {
        return this.to(new Stream(function (value) {
            this.emit(value[name]);
        }));
    }

    set(name, handler) {
        return this.to(new Stream(function (value, index) {
            value[name] = handler(value, index);
            this.emit(value);
        }));
    }

    repeat(handler) {
        return this.to(new Stream(function (value, index) {
            let count = handler(value, index);
            for (let i = 0; i < count; i++)
                this.emit(value);
        }));
    }

    repeatCount(count) {
        return this.to(new Stream(function (value) {
            for (let i = 0; i < count; i++)
                this.emit(value);
        }));
    }

    flatten() {
        return this.to(new Stream(function (value) {
            value.forEach(item => {
                this.emit(item);
            });
        }));
    }

    join(stream) {
        return stream.to(this.to(new Stream()));
    }

    wait() {
        return this.to(new Stream(function (value) {
            value.then(resolve => {
                this.emit(resolve);
            }).catch(() => {
            });
        }));
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
