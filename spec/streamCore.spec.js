const stream = require('../src/index.js');

describe('core', () => {
    let s, spy1, spy2, spy3;

    beforeEach(() => {
        s = stream();
        spy1 = jasmine.createSpy('spy1');
        spy2 = jasmine.createSpy('spy2');
        spy3 = jasmine.createSpy('spy3');
    });

    it('each', () => {
        let s2 = s.each(spy1);
        let s3 = s2.each(spy2);
        s.write(10);
        s.write(11);
        s.write(12);
        expect(spy1).toHaveBeenCalledTimes(3);
        expect(spy1).toHaveBeenCalledWith(10, 0);
        expect(spy1).toHaveBeenCalledWith(11, 1);
        expect(spy1).toHaveBeenCalledWith(12, 2);
        expect(spy1).toHaveBeenCalledTimes(3);
        expect(spy1).toHaveBeenCalledWith(10, 0);
        expect(spy1).toHaveBeenCalledWith(11, 1);
        expect(spy1).toHaveBeenCalledWith(12, 2);
        expect(s.outValues).toEqual([10, 11, 12]);
        expect(s2.outValues).toEqual([10, 11, 12]);
        expect(s3.outValues).toEqual([10, 11, 12]);
    });

    it('map', () => {
        spy1.and.callFake(x => x * 2);
        spy2.and.callFake(x => [x + 3]);
        let s2 = s.map(spy1);
        let s3 = s2.map(spy2);
        s.write(10);
        s.write(11);
        s.write(12);
        expect(spy1).toHaveBeenCalledTimes(3);
        expect(spy1).toHaveBeenCalledWith(10, 0);
        expect(spy1).toHaveBeenCalledWith(11, 1);
        expect(spy1).toHaveBeenCalledWith(12, 2);
        expect(spy2).toHaveBeenCalledTimes(3);
        expect(spy2).toHaveBeenCalledWith(20, 0);
        expect(spy2).toHaveBeenCalledWith(22, 1);
        expect(spy2).toHaveBeenCalledWith(24, 2);
        expect(s.outValues).toEqual([10, 11, 12]);
        expect(s2.outValues).toEqual([20, 22, 24]);
        expect(s3.outValues).toEqual([[23], [25], [27]]);
    });

    it('filter', () => {
        spy1.and.callFake(x => x < 12);
        let s2 = s.filter(spy1);
        s.write(10);
        s.write(11);
        s.write(12);
        s.write(13);
        expect(spy1).toHaveBeenCalledTimes(4);
        expect(spy1).toHaveBeenCalledWith(10, 0);
        expect(spy1).toHaveBeenCalledWith(11, 1);
        expect(spy1).toHaveBeenCalledWith(12, 2);
        expect(spy1).toHaveBeenCalledWith(13, 3);
        expect(s.outValues).toEqual([10, 11, 12, 13]);
        expect(s2.outValues).toEqual([10, 11]);
    });
});
