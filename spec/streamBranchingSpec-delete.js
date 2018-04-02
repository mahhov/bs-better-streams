const st = require('../src/index.js');

xdescribe('branching', () => {
    let stream;

    beforeEach(() => {
        stream = st([1, 2, 3, 4, 5, 6])
    });

    it('#if #then #else #done', () => {
        let result = st([1, 2, 3, 4, 5, 6])
            .if(num => num > 2)
            .then(stream => stream
                .map(num => num + 1))
            .else(stream => stream
                .map(num => num + 5))
            .done()
            .map(num => num * 10);
        expect(result.value).toEqual([40, 50, 60, 70, 60, 70]);
    });

    it('#if #then #else #elseIf #done', () => {
        let result = st([1, 2, 3, 4, 5, 6])
            .if(num => num < 2)
            .then(stream => stream
                .map(num => num + 1))
            .elseIf(num => num <= 3)
            .then(stream => stream
                .map(num => num + 5))
            .elseIf(num => num > 0 && num < 4)
            .then(stream => stream
                .map(num => num - 2))
            .else(stream => stream
                .map(num => num - 8))
            .done()
            .map(num => num * 10);
        expect(result.value).toEqual([20, 70, 80, -40, -30, -20]);
    });
});
