const stream = require('../src/index.js');

describe('accumulation', () => {
    let s, spy1, spy2, spy3;

    beforeEach(() => {
        s = stream();
        spy1 = jasmine.createSpy('spy1');
        spy2 = jasmine.createSpy('spy2');
        spy3 = jasmine.createSpy('spy3');
    });

    it('accumulation', () => {
        s.write(10);
        let s2 = s.each(spy1);
        s.write(11);
        let s3 = s2.each(spy2);
        s.write(12);
        expect(spy1).toHaveBeenCalledTimes(3);
        expect(spy1).toHaveBeenCalledWith(10, 0);
        expect(spy1).toHaveBeenCalledWith(11, 1);
        expect(spy1).toHaveBeenCalledWith(12, 2);
        expect(spy2).toHaveBeenCalledTimes(3);
        expect(spy2).toHaveBeenCalledWith(10, 0);
        expect(spy2).toHaveBeenCalledWith(11, 1);
        expect(spy2).toHaveBeenCalledWith(12, 2);
        expect(s.outValues).toEqual([10, 11, 12]);
        expect(s2.outValues).toEqual([10, 11, 12]);
        expect(s3.outValues).toEqual([10, 11, 12]);
    });

    it('outValue updated before next streams invoked', () => {
        s.write(10);
        let s2 = s.each(() => spy1([...s.outValues]));
        s.write(20);
        s2.write(30);
        expect(spy1).toHaveBeenCalledTimes(2);
        expect(spy1).toHaveBeenCalledWith([10]);
        expect(spy1).toHaveBeenCalledWith([10, 20]);
    });
});
