const stream = require('../src/index.js');

describe('write', () => {
    let s, spy1, spy2, spy3;

    beforeEach(() => {
        s = stream();
        spy1 = jasmine.createSpy('spy1');
        spy2 = jasmine.createSpy('spy2');
        spy3 = jasmine.createSpy('spy3');
    });

    it('multiple arguments', () => {
        let s2 = s.write(10, 11, 12);
        let s3 = s.each(spy1);
        let s4 = s3.each(spy2);
        expect(spy1).toHaveBeenCalledTimes(3);
        expect(spy1).toHaveBeenCalledWith(10, 0);
        expect(spy1).toHaveBeenCalledWith(11, 1);
        expect(spy1).toHaveBeenCalledWith(12, 2);
        expect(spy1).toHaveBeenCalledTimes(3);
        expect(spy1).toHaveBeenCalledWith(10, 0);
        expect(spy1).toHaveBeenCalledWith(11, 1);
        expect(spy1).toHaveBeenCalledWith(12, 2);
        expect(s.outValues).toEqual([10, 11, 12]);
        expect(s3.outValues).toEqual([10, 11, 12]);
        expect(s4.outValues).toEqual([10, 11, 12]);
        expect(s2).toEqual(s);
    });

    it('single list argument', () => {
        let s2 = s.write(...[10, 11, 12]);
        let s3 = s.each(spy1);
        let s4 = s3.each(spy2);
        expect(spy1).toHaveBeenCalledTimes(3);
        expect(spy1).toHaveBeenCalledWith(10, 0);
        expect(spy1).toHaveBeenCalledWith(11, 1);
        expect(spy1).toHaveBeenCalledWith(12, 2);
        expect(spy1).toHaveBeenCalledTimes(3);
        expect(spy1).toHaveBeenCalledWith(10, 0);
        expect(spy1).toHaveBeenCalledWith(11, 1);
        expect(spy1).toHaveBeenCalledWith(12, 2);
        expect(s.outValues).toEqual([10, 11, 12]);
        expect(s3.outValues).toEqual([10, 11, 12]);
        expect(s4.outValues).toEqual([10, 11, 12]);
        expect(s2).toEqual(s);
    });

    it('promise', done => {
        let resolved = Promise.resolve(10);
        let rejected = Promise.reject(15);
        let s2 = s.writePromise(resolved, rejected);
        s.each(value => {
            expect(value).toEqual(10);
            done();
        });
        expect(s2).toEqual(s);
    });
});
