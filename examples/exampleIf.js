const b_ = require('../src/index');

let promiseProvider = x => {
    return Promise.resolve(x + 1);
};

let test = async () => {
    let list = b_([1, 2, 3, 4, 5, 6]);

    list
        .if(x => x > 2)
        .then(b_ =>
            b_.map(x => x + 1))
        .else(b_ => b_
            .map(x => x + 5))
        .done()
        .map(x => x * 10)
        .each(x => console.log(x))
};

test();