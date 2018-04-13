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
        return this.repeat(() => count);
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

    if(handler) {
        let then = new Stream();
        let els = new Stream();

        this.to(new Stream((value, index) => {
            handler(value, index) ? then.emit(value) : els.emit(value);
        }));

        return {then, else: els};
    }

    group(handler) {
        let groups = {};

        this.to(new Stream((value, index) => {
            let group = handler(value, index);
            groups[group] = groups[group] || new Stream();
            groups[group].emit(value);
        }));

        return groups;
    }

    groupCount(count) {
        return this.group((value, index) =>
            `group${parseInt(index / count)}`);
    }

    groupFirstCount(count) {
        return this.group((value, index) =>
            index < count ? 'first' : 'rest');
    }

    groupNCount(count, n) {
        return this.group((value, index) => {
            let group = parseInt(index / count);
            return group < n ? `group${group}` : 'rest';
        });
    }

    groupIndex(...indexesSet) {
        return this.group((value, index) => {
            let groupIndex = indexesSet.findIndex(indexes => indexes.includes(index));
            return groupIndex !== -1 ? groupIndex : 'rest';
        });
    }

    batch(count) {
        let buffer = [];
        return this.to(new Stream(function (value) {
            if (buffer.push(value) >= count) {
                this.emit(buffer);
                buffer = [];
            }
        }));
    }

    generate(handler) {
        return this.to(new Stream(function (value, index) {
            let values = handler(value, index);
            this.emit(value);
            values.forEach(value => {
                this.emit(value);
            });
        }));
    }

    flatMap(handler) {
        return this.to(new Stream(function (value, index) {
            let values = handler(value, index);
            values.forEach(value => {
                this.emit(value);
            });
        }));
    }

    throttle(count = 0) {
        let queue = [];
        let unthrottled;

        let stream = this.to(new Stream(function (value) {
            if (count > 0 || unthrottled) {
                count--;
                this.emit(value);
            } else
                queue.push(value);
        }));

        let next = (n = 1) => {
            count += n;
            while (count > 0 && queue.length) {
                count--;
                stream.emit(queue.shift());
            }
        };

        let unthrottle = () => {
            unthrottled = true;
            queue.forEach(value => {
                stream.emit(value)
            });
            queue = [];
        };

        return {stream, next, unthrottle}
    }

    get length() {
        return this.outValues.length;
    }
}

module.exports = Stream;

// todo
// elseif
// for n
// for iterate
// on / trigger
// stopOn
// while/until loops
// syntax for if / group by / throttled
