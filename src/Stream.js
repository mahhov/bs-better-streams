class Stream {
    constructor(preWrite) {
        this.values = [];
        this.next = [];
        this.preWrite = preWrite;
    }

    write(value) {
        this.preWrite && this.preWrite(value, this.values.length);

        this.next.forEach(nextStream => {
            nextStream.write(value, this.values.length);
        });

        this.values.push(value);
    }

    each(handler) {
        let stream = new Stream(handler);
        this.next.push(stream);
        return stream;
    }

    get length() {
        return this.values.length;
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
