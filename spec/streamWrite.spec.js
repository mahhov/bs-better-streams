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

    it('promise', async () => {
        let rejected = Promise.reject(15);
        let resolved = Promise.resolve(10);
        let s2 = s.writePromise(rejected, resolved);
        await s.promise;
        expect(s.outValues.length).toEqual(2);
        expect(s.outValues).toContain(10);
        expect(s.outValues).toContain({rejected: 15, isRejected: true});
        expect(s2).toEqual(s);
    });

    it('promise catch', async () => {
        s.writePromise(Promise.resolve(3), Promise.reject(4));
        let s2 = s.each(() => null);
        s.each(() => {
            throw 'expected error';
        });
        await s2.promise;
        expect(s2.outValues.length).toEqual(2);
        expect(s2.outValues).toContain(3);
        expect(s2.outValues).toContain({rejected: 4, isRejected: true});
    });

    it('promiseSkipOnReject', async () => {
        let rejected = Promise.reject(15);
        let resolved = Promise.resolve(10);
        let s2 = s.writePromiseSkipOnReject(rejected, resolved);
        await s.promise;
        expect(s.outValues).toEqual([10]);
        expect(s2).toEqual(s);
    });

    it('write intermediate stream', () => {
        let s2 = s.map(a => a + 1);
        let s3 = s2.map(a => a * 2);
        s.write(10);
        s2.write(100);
        s3.write(1000);
        expect(s.outValues).toEqual([10]);
        expect(s2.outValues).toEqual([11, 100]);
        expect(s3.outValues).toEqual([22, 200, 1000]);
    });
});
