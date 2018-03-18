const st = require('../src/index.js');

describe('stream basic methods', () => {
    let stream;

    beforeEach(() => {
        stream = st([1, 2, 3]);
    });

    it('#value', () => {
        expect(stream.value).toEqual([1, 2, 3]);
    });

    it('#each', () => {
        let handler = jasmine.createSpy('handler');
        stream.each(handler);
        expect(handler).toHaveBeenCalledTimes(3);
        expect(handler).toHaveBeenCalledWith(1, 0, [1, 2, 3]);
        expect(handler).toHaveBeenCalledWith(2, 1, [1, 2, 3]);
        expect(handler).toHaveBeenCalledWith(3, 2, [1, 2, 3]);
        expect(stream.value).toEqual([1, 2, 3]);
    });

    it('#map', function () {
        let handler = jasmine.createSpy('handler').and.callFake(x => x * 2);
        stream.map(handler);
        expect(handler).toHaveBeenCalledTimes(3);
        expect(handler).toHaveBeenCalledWith(1, 0, [1, 2, 3]);
        expect(handler).toHaveBeenCalledWith(2, 1, [1, 2, 3]);
        expect(handler).toHaveBeenCalledWith(3, 2, [1, 2, 3]);
        expect(stream.value).toEqual([2, 4, 6]);
    });
});
