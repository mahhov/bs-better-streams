class Stream {
    constructor(writer) {
        this.outValues = [];
        this.inputCount = 0;
        this.next = [];
        this.writer = writer;
    }

    _addNext(stream) {
        this.next.push(stream);
        return stream
    }

    write(value) {
        let outValues = typeof this.writer === 'function' ? this.writer(value, this.inputCount++) : [value];

        outValues.forEach(outValue => {
            this.next.forEach(nextStream => {
                nextStream.write(outValue);
            });
            this.outValues.push(outValue);
        });
    }

    each(handler) {
        return this._addNext(new Stream((value, index) => {
            handler(value, index);
            return [value];
        }));
    }

    map(handler) {
        return this._addNext(new Stream((value, index) => {
            return [handler(value, index)];
        }));
    }

    get length() {
        return this.inputCount;
    }
}

module.exports = Stream;

// todo
// each
// map
// filter
// filter n
// filterIndex
// pluck
// set
// flatten
// union
// repeat
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
// accumulate for later
