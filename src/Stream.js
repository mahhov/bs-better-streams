class Stream {
    constructor(absorber) {
        this.outValues = [];
        this.inputCount = 0;
        this.next = [];
        this.absorber = absorber || this.defaultAbsorber;
    }

    to(stream) {
        this.next.push(stream);
        this.outValues.forEach(value => {
            stream.absorb(value);
        });
        return stream
    }

    defaultAbsorber(a) {
        this.write(a);
    }

    absorb(...values) {
        values.forEach(value => {
            this.absorber(value, this.inputCount++);
        });
    }

    write(...outValue) {
        this.next.forEach(nextStream => {
            nextStream.absorb(...outValue);
        });
        this.outValues.push(...outValue);
        return this;
    }

    writePromise(...promises) {
        promises.forEach(promise => {
            promise.then(value => {
                this.write(value);
            }).catch(() => {
            });
        });
        return this;
    }

    each(handler) {
        return this.to(new Stream(function (value, index) {
            handler(value, index);
            this.write(value);
        }));
    }

    map(handler) {
        return this.to(new Stream(function (value, index) {
            this.write(handler(value, index));
        }));
    }

    filter(handler) {
        return this.to(new Stream(function (value, index) {
            handler(value, index) && this.write(value)
        }));
    }

    filterCount(count) {
        return this.filter((value, index) => index < count);
    }

    filterIndex(indexes) {
        return this.filter((value, index) => indexes.includes(index));
    }

    filterMap(handler, trueHandler, falseHandler = a => a) {
        return this.to(new Stream(function (value, index) {
            this.write((handler(value, index) ? trueHandler : falseHandler)(value, index));
        }));
    }

    unique() {
        return this.to(new Stream(function (value) {
            this.outValues.includes(value) || this.write(value);
        }));
    }

    uniqueOn(name) {
        return this.to(new Stream(function (value) {
            this.outValues.some(outValue => outValue[name] === value[name]) || this.write(value);
        }));
    }

    uniqueX(handler) {
        return this.to(new Stream(function (value) {
            this.outValues.some(outValue => handler(outValue) === handler(value)) || this.write(value);
        }));
    }

    pluck(name) {
        return this.to(new Stream(function (value) {
            this.write(value[name]);
        }));
    }

    wrap(name) {
        return this.to(new Stream(function (value) {
            let wrapped = {};
            wrapped[name] = value;
            this.write(wrapped);
        }));
    }

    pick(...names) {
        return this.to(new Stream(function (value) {
            let picked = {};
            names.forEach(name => {
                picked[name] = value[name];
            });
            this.write(picked);
        }));
    }

    omit(...names) {
        return this.to(new Stream(function (value) {
            let omitted = Object.assign({}, value);
            names.forEach(name => {
                delete omitted[name];
            });
            this.write(omitted);
        }));
    }

    set(name, handler) {
        return this.to(new Stream(function (value, index) {
            value[name] = handler(value, index);
            this.write(value);
        }));
    }

    repeat(handler) {
        return this.to(new Stream(function (value, index) {
            let count = handler(value, index);
            for (let i = 0; i < count; i++)
                this.write(value);
        }));
    }

    repeatCount(count) {
        return this.repeat(() => count);
    }

    flatten() {
        return this.to(new Stream(function (value) {
            this.write(...value);
        }));
    }

    flattenOn(name, nameTo) {
        return this.to(new Stream(function (value) {
            value[name].forEach(item => {
                let flattened = Object.assign({}, value);
                delete flattened[name];
                flattened[nameTo] = item;
                this.write(flattened);
            });
        }));
    }

    join(stream) {
        return stream.to(this.to(new Stream()));
    }

    product(stream, leftId, rightId, name) {
        return this.to(new Stream(function (left) {
            stream
                .filter(right => left[leftId] === right[rightId])
                .each(right => {
                    let product = Object.assign({}, left);
                    product[name] = right;
                    this.write(product);
                });
        }));
    }

    productX(rightStream, leftIdHandler, rightIdHandler, productHandler) {
        return this.to(new Stream(function (left) {
            rightStream
                .filter(right => leftIdHandler(left) === rightIdHandler(right))
                .each(right => {
                    this.write(productHandler(left, right));
                });
        }));
    }

    wait() {
        return this.to(new Stream(function (value) {
            value.then(resolve => {
                this.write(resolve);
            }).catch(() => {
            });
        }));
    }

    waitOn(name) {
        return this.to(new Stream(function (value) {
            value[name].then(resolve => {
                let waited = Object.assign({}, value);
                waited[name] = resolve;
                this.write(waited);
            }).catch(() => {
            });
        }));
    }

    waitOrdered() {
        let prevWrapPromise = Promise.resolve();
        return this.to(new Stream(function (value) {
            prevWrapPromise = prevWrapPromise.then(() =>
                value.then(resolve => {
                    this.write(resolve);
                }).catch(() => {
                }))
        }));
    }

    waitOnOrdered(name) {
        let prevWrapPromise = Promise.resolve();
        return this.to(new Stream(function (value) {
            prevWrapPromise = prevWrapPromise.then(() =>
                value[name].then(resolve => {
                    let waited = Object.assign({}, value);
                    waited[name] = resolve;
                    this.write(waited);
                }).catch(() => {
                }))
        }));
    }

    if(handler) {
        let then = new Stream();
        let els = new Stream();

        this.to(new Stream((value, index) => {
            handler(value, index) ? then.write(value) : els.write(value);
        }));

        return {then, else: els};
    }

    split(handler, trueHandler, falseHandler = a => a) {
        let then = new Stream();
        let els = new Stream();

        let thenOut = trueHandler(then);
        let elsOut = falseHandler(els);

        let join = thenOut.join(elsOut);

        this.to(new Stream((value, index) => {
            handler(value, index) ? then.write(value) : els.write(value);
        }));

        return join;
    }

    group(handler) {
        let groups = {};

        this.to(new Stream((value, index) => {
            let group = handler(value, index);
            groups[group] = groups[group] || new Stream();
            groups[group].write(value);
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
                this.write(buffer);
                buffer = [];
            }
        }));
    }

    generate(handler) {
        return this.to(new Stream(function (value, index) {
            let values = handler(value, index);
            this.write(value);
            values.forEach(value => {
                this.write(value);
            });
        }));
    }

    flatMap(handler) {
        return this.to(new Stream(function (value, index) {
            let values = handler(value, index);
            this.write(...values);
        }));
    }

    throttle(count = 0) {
        let queue = [];
        let unthrottled;

        let stream = this.to(new Stream(function (value) {
            if (count > 0 || unthrottled) {
                count--;
                this.write(value);
            } else
                queue.push(value);
        }));

        let next = (n = 1) => {
            count += n;
            let removeCount = Math.min(count, queue.length);
            count -= removeCount;
            stream.write(...queue.splice(0, removeCount));
        };

        let nextOne = () => {
            next();
        };

        let unthrottle = () => {
            unthrottled = true;
            stream.write(...queue);
            queue = [];
        };

        return {stream, next, nextOne, unthrottle}
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
// product & filterCount & filterIndex to be more efficient
// nest (opposite of flattenOn) (sibling of wrap)
// wait [on] [ordered] to accept non promises
