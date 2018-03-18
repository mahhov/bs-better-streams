class StreamIf {
    // constructor(b_Obj, predicate) {
    //     let trues = [];
    //     let falses = [];
    //     b_Obj.each((elem, ...args) => {
    //         (predicate(elem, ...args) ? trues : falses).push(elem);
    //     });
    //     this.thenValue = b_(trues);
    //     this.elseValue = b_(falses);
    // }
    //
    // then(handler) {
    //     this.thenValue = handler(this.thenValue);
    //     return this;
    // }
    //
    // else(handler) {
    //     this.elseValue = handler(this.elseValue);
    //     return this;
    // }
    //
    // done() {
    //     return b_(this.thenValue.value.concat(this.elseValue.value));
    // }
}

module.exports = StreamIf;
