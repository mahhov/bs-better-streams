const st = require('../src/index.js');

describe('if', () => {
    let stream;

    beforeEach(() => {
        stream = st([1, 2, 3, 4, 5, 6])
    });

    it('overview', function () {
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
});
