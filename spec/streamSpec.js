const st = require('../src/index.js');

describe('stream basic methods', () => {
    let stream, streamObj;

    beforeEach(() => {
        stream = st([1, 2, 3]);
        streamObj = st([{v: 1}, {v: 2}, {v: 3}]);
    });

    it('#value', () => {
        expect(stream.value).toEqual([1, 2, 3]);
    });

    it('#each', () => {
        let handler = jasmine.createSpy('handler');
        let result = stream.each(handler);
        expect(handler).toHaveBeenCalledTimes(3);
        expect(handler).toHaveBeenCalledWith(1, 0, [1, 2, 3]);
        expect(handler).toHaveBeenCalledWith(2, 1, [1, 2, 3]);
        expect(handler).toHaveBeenCalledWith(3, 2, [1, 2, 3]);
        expect(stream.value).toEqual([1, 2, 3]);
        expect(result.value).toEqual([1, 2, 3]);
        stream.value[0] = 5;
        expect(result.value[0]).toEqual(5);
    });

    it('#map', () => {
        let handler = jasmine.createSpy('handler').and.callFake(x => x * 2);
        let result = stream.map(handler);
        expect(handler).toHaveBeenCalledTimes(3);
        expect(handler).toHaveBeenCalledWith(1, 0, [1, 2, 3]);
        expect(handler).toHaveBeenCalledWith(2, 1, [1, 2, 3]);
        expect(handler).toHaveBeenCalledWith(3, 2, [1, 2, 3]);
        expect(stream.value).toEqual([1, 2, 3]);
        expect(result.value).toEqual([2, 4, 6]);

    });

    it('filter', () => {
        let handler = jasmine.createSpy('handler').and.callFake(x => x % 2 !== 0);
        let result = stream.filter(handler);
        expect(handler).toHaveBeenCalledTimes(3);
        expect(handler).toHaveBeenCalledWith(1, 0, [1, 2, 3]);
        expect(handler).toHaveBeenCalledWith(2, 1, [1, 2, 3]);
        expect(handler).toHaveBeenCalledWith(3, 2, [1, 2, 3]);
        expect(stream.value).toEqual([1, 2, 3]);
        expect(result.value).toEqual([1, 3]);
        stream.value[0] = 5;
        expect(result.value[0]).toEqual(1);
    });

    it('pluck', () => {
        let result = streamObj.pluck('v');
        expect(streamObj.value).toEqual([{v: 1}, {v: 2}, {v: 3}]);
        expect(result.value).toEqual([1, 2, 3]);
    });

    it('set', () => {
        let handler = jasmine.createSpy('handler').and.callFake(elem => elem.v + 3);
        let result = streamObj.set('vPlus3', handler);
        expect(handler).toHaveBeenCalledTimes(3);
        expect(streamObj.value).toEqual([{v: 1, vPlus3: 4}, {v: 2, vPlus3: 5}, {v: 3, vPlus3: 6}]);
        expect(result.value).toEqual(streamObj.value);
        streamObj.value[0] = 5;
        expect(result.value[0]).toEqual(5);
    });
});
