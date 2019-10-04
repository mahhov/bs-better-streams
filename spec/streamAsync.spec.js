const stream = require('../src/index.js');

describe('async', () => {
    let s, spy1, spy2, spy3;

    beforeEach(() => {
        s = stream();
        spy1 = jasmine.createSpy('spy1');
        spy2 = jasmine.createSpy('spy2');
        spy3 = jasmine.createSpy('spy3');
    });

    it('wait', async () => {
        let s2 = s.wait(true);
        let s3 = s.wait();
        let promise1 = Promise.resolve(1);
        let promise2 = Promise.resolve(2);
        let promise3 = Promise.resolve(3);
        let promise4 = Promise.reject(4);
        s.write(promise1);
        s.write(promise2);
        s.write(2.5);
        s.write(promise3);
        s.write(promise4);
        await s.promise.catch(() => null);
        expect(s.outValues).toEqual([promise1, promise2, 2.5, promise3, promise4]);
        expect(s2.outValues).toEqual([1, 2, 2.5, 3]);
        expect(s3.outValues).toEqual([1, 2, 2.5, 3, {rejected: 4, isRejected: true}]);
    });

    it('waitOn', async () => {
        let s2 = s.waitOn('key', true);
        let s3 = s.waitOn('key');
        let promise1 = Promise.resolve(1);
        let promise2 = Promise.resolve(2);
        let promise3 = Promise.resolve(3);
        let promise4 = Promise.reject(4);
        s.write({key: promise1});
        s.write({key: promise2});
        s.write({key: 2.5});
        s.write({key: promise3});
        s.write({key: promise4});
        await s.promise;
        expect(s.outValues).toEqual([{key: promise1}, {key: promise2}, {key: 2.5}, {key: promise3}, {key: promise4}]);
        expect(s2.outValues).toEqual([{key: 1}, {key: 2}, {key: 2.5}, {key: 3}]);
        expect(s3.outValues).toEqual([{key: 1}, {key: 2}, {key: 2.5}, {key: 3}, {key: {rejected: 4, isRejected: true}}]);
    });

    it('waitOrdered', async () => {
        let s2 = s.waitOrdered(true);
        let s3 = s.waitOrdered();
        let promise1 = createPromise();
        let promise2 = createPromise();
        let promise3 = createPromise();
        let promise4 = createPromise();
        let promise5 = createPromise();
        let promise6 = createPromise();
        let promise7 = createPromise();
        let promise8 = createPromise();
        s.write(promise1);
        s.write(promise2);
        s.write(promise3);
        s.write(promise4);
        s.write(4.5);
        s.write(promise5);
        s.write(promise6);
        s.write(promise7);
        s.write(promise8);
        promise7.sresolve(7);
        promise8.sresolve(8);
        promise3.sresolve(3);
        promise4.sreject(4);
        promise2.sresolve(2);
        promise1.sresolve(1);
        promise5.sresolve(5);
        promise6.sresolve(6);
        await promise6 && await sleep();
        expect(s.outValues).toEqual([promise1, promise2, promise3, promise4, 4.5, promise5, promise6, promise7, promise8]);
        expect(s2.outValues).toEqual([1, 2, 3, 4.5, 5, 6, 7, 8]);
        expect(s3.outValues).toEqual([1, 2, 3, {rejected: 4, isRejected: true}, 4.5, 5, 6, 7, 8]);
    });

    it('waitOnOrdered', async () => {
        let s2 = s.waitOnOrdered('key', true);
        let s3 = s.waitOnOrdered('key');
        let promise1 = createPromise();
        let promise2 = createPromise();
        let promise3 = createPromise();
        let promise4 = createPromise();
        let promise5 = createPromise();
        let promise6 = createPromise();
        let promise7 = createPromise();
        let promise8 = createPromise();
        s.write({key: promise1});
        s.write({key: promise2});
        s.write({key: promise3});
        s.write({key: promise4});
        s.write({key: 4.5});
        s.write({key: promise5});
        s.write({key: promise6});
        s.write({key: promise7});
        s.write({key: promise8});
        promise7.sresolve(7);
        promise8.sresolve(8);
        promise3.sresolve(3);
        promise4.sreject(4);
        promise2.sresolve(2);
        promise1.sresolve(1);
        promise5.sresolve(5);
        promise6.sresolve(6);
        await promise6 && await sleep();
        expect(s.outValues).toEqual([{key: promise1}, {key: promise2}, {key: promise3}, {key: promise4}, {key: 4.5}, {key: promise5}, {key: promise6}, {key: promise7}, {key: promise8}]);
        expect(s2.outValues).toEqual([{key: 1}, {key: 2}, {key: 3}, {key: 4.5}, {key: 5}, {key: 6}, {key: 7}, {key: 8}]);
        expect(s3.outValues).toEqual([{key: 1}, {key: 2}, {key: 3}, {key: {rejected: 4, isRejected: true}}, {key: 4.5}, {key: 5}, {key: 6}, {key: 7}, {key: 8}]);
    });

    it('wait catch', async () => {
        let s2 = s.wait();
        let promise1 = Promise.resolve(1);
        let promise2 = Promise.resolve(2);
        let promise3 = Promise.resolve(3);
        let promise4 = Promise.reject(4);
        s.write(promise1);
        s.write(promise2);
        s.write(2.5);
        s.write(promise3);
        s.write(promise4);
        let s3 = s2.each(() => null);
        s2.each(() => {
            throw 'expected error';
        });
        await s.promise.catch(() => null);
        expect(s.outValues).toEqual([promise1, promise2, 2.5, promise3, promise4]);
        expect(s3.outValues).toEqual([1, 2, 2.5, 3, {rejected: 4, isRejected: true}]);
    });

    it('waitOn catch', async () => {
        let s2 = s.waitOn('key');
        let promise1 = Promise.resolve(1);
        let promise2 = Promise.resolve(2);
        let promise3 = Promise.resolve(3);
        let promise4 = Promise.reject(4);
        s.write({key: promise1});
        s.write({key: promise2});
        s.write({key: 2.5});
        s.write({key: promise3});
        s.write({key: promise4});
        let s3 = s2.each(() => null);
        s2.each(() => {
            throw 'expected error';
        });
        await s.promise;
        expect(s.outValues).toEqual([{key: promise1}, {key: promise2}, {key: 2.5}, {key: promise3}, {key: promise4}]);
        expect(s3.outValues).toEqual([{key: 1}, {key: 2}, {key: 2.5}, {key: 3}, {key: {rejected: 4, isRejected: true}}]);
    });

    it('waitOrdered catch', async () => {
        let s2 = s.waitOrdered();
        let promise1 = createPromise();
        let promise2 = createPromise();
        let promise3 = createPromise();
        let promise4 = createPromise();
        let promise5 = createPromise();
        let promise6 = createPromise();
        let promise7 = createPromise();
        let promise8 = createPromise();
        s.write(promise1);
        s.write(promise2);
        s.write(promise3);
        s.write(promise4);
        s.write(4.5);
        s.write(promise5);
        s.write(promise6);
        s.write(promise7);
        s.write(promise8);
        promise7.sresolve(7);
        promise8.sresolve(8);
        promise3.sresolve(3);
        promise4.sreject(4);
        promise2.sresolve(2);
        promise1.sresolve(1);
        promise5.sresolve(5);
        promise6.sresolve(6);
        let s3 = s2.each(() => null);
        s2.map(() => {
            throw 'expected error';
        });
        await promise6 && await sleep();
        expect(s.outValues).toEqual([promise1, promise2, promise3, promise4, 4.5, promise5, promise6, promise7, promise8]);
        expect(s3.outValues).toEqual([1, 2, 3, {rejected: 4, isRejected: true}, 4.5, 5, 6, 7, 8]);
    });

    it('waitOnOrdered catch', async () => {
        let s2 = s.waitOnOrdered('key');
        let promise1 = createPromise();
        let promise2 = createPromise();
        let promise3 = createPromise();
        let promise4 = createPromise();
        let promise5 = createPromise();
        let promise6 = createPromise();
        let promise7 = createPromise();
        let promise8 = createPromise();
        s.write({key: promise1});
        s.write({key: promise2});
        s.write({key: promise3});
        s.write({key: promise4});
        s.write({key: 4.5});
        s.write({key: promise5});
        s.write({key: promise6});
        s.write({key: promise7});
        s.write({key: promise8});
        promise7.sresolve(7);
        promise8.sresolve(8);
        promise3.sresolve(3);
        promise4.sreject(4);
        promise2.sresolve(2);
        promise1.sresolve(1);
        promise5.sresolve(5);
        promise6.sresolve(6);
        let s3 = s2.each(() => null);
        s2.each(() => {
            throw 'expected error';
        });
        await promise6 && await sleep();
        expect(s.outValues).toEqual([{key: promise1}, {key: promise2}, {key: promise3}, {key: promise4}, {key: 4.5}, {key: promise5}, {key: promise6}, {key: promise7}, {key: promise8}]);
        expect(s3.outValues).toEqual([{key: 1}, {key: 2}, {key: 3}, {key: {rejected: 4, isRejected: true}}, {key: 4.5}, {key: 5}, {key: 6}, {key: 7}, {key: 8}]);
    });

    it('get promise', (done) => {
        let s2 = s.wait();
        let promise1 = createPromise();
        let promise2 = createPromise();
        let promise3 = createPromise();
        s.write(promise1);
        s.write(promise2);
        expect(s2.outValues.length).toEqual(0);
        s.promise.then(resolve => {
            expect(resolve).toEqual([1, 2]);
            expect(s2.outValues).toEqual([2, 1]);
            done();
        });
        s.write(promise3);
        promise3.sresolve(3);
        promise2.resolve(2);
        promise1.resolve(1);
    });

    let createPromise = () => {
        let resolve, reject;
        let promise = new Promise((resolv, rejec) => {
            resolve = resolv;
            reject = rejec;
        });
        promise.catch(a => a);
        promise.resolve = resolve;
        promise.reject = reject;
        promise.sreject = value => sleep().then(() => reject(value));
        promise.sresolve = value => sleep().then(() => resolve(value));
        return promise;
    };

    let sleep = (milli = 0) => new Promise(resolve => setTimeout(resolve, milli));
});
