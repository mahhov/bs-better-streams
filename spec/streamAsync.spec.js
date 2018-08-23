const stream = require('../src/index.js');

describe('async', () => {
    let s, spy1, spy2, spy3;

    beforeEach(() => {
        s = stream();
        spy1 = jasmine.createSpy('spy1');
        spy2 = jasmine.createSpy('spy2');
        spy3 = jasmine.createSpy('spy3');
    });

    it('wait', done => {
        let s2 = s.wait();
        let promise1 = Promise.resolve(1);
        let promise2 = Promise.resolve(2);
        let promise3 = Promise.resolve(3);
        let promise4 = Promise.reject(4);
        s.write(promise1);
        s.write(promise2);
        s.write(promise3);
        s.write(promise4);
        Promise.all([promise1, promise2, promise3]).then(() => {
            expect(s.outValues).toEqual([promise1, promise2, promise3, promise4]);
            expect(s2.outValues).toEqual([1, 2, 3]);
            done();
        });
    });

    it('waitOn', done => {
        let s2 = s.waitOn('key');
        let promise1 = Promise.resolve(1);
        let promise2 = Promise.resolve(2);
        let promise3 = Promise.resolve(3);
        let promise4 = Promise.reject(4);
        s.write({key: promise1});
        s.write({key: promise2});
        s.write({key: promise3});
        s.write({key: promise4});
        Promise.all([promise1, promise2, promise3]).then(() => {
            expect(s.outValues).toEqual([{key: promise1}, {key: promise2}, {key: promise3}, {key: promise4}]);
            expect(s2.outValues).toEqual([{key: 1}, {key: 2}, {key: 3}]);
            done();
        });
    });

    it('waitOrdered', done => {
        let s2 = s.waitOrdered();
        let promiseWrap1 = createPromise();
        let promiseWrap2 = createPromise();
        let promiseWrap3 = createPromise();
        let promiseWrap4 = createPromise();
        s.write(promiseWrap1.promise);
        s.write(promiseWrap2.promise);
        s.write(promiseWrap3.promise);
        s.write(promiseWrap4.promise);
        promiseWrap3.resolve(3);
        promiseWrap2.resolve(2);
        promiseWrap1.resolve(1);
        promiseWrap4.reject(4);
        Promise.all([promiseWrap1.promise, promiseWrap2.promise, promiseWrap3.promise, s2.absorber(Promise.reject())]).then(() => {
            expect(s.outValues).toEqual([promiseWrap1.promise, promiseWrap2.promise, promiseWrap3.promise, promiseWrap4.promise]);
            expect(s2.outValues).toEqual([1, 2, 3]);
            done();
        });
    });

    it('waitOnOrdered', done => {
        let s2 = s.waitOnOrdered('key');
        let promiseWrap1 = createPromise();
        let promiseWrap2 = createPromise();
        let promiseWrap3 = createPromise();
        let promiseWrap4 = createPromise();
        s.write({key: promiseWrap1.promise});
        s.write({key: promiseWrap2.promise});
        s.write({key: promiseWrap3.promise});
        s.write({key: promiseWrap4.promise});
        promiseWrap3.resolve(3);
        promiseWrap2.resolve(2);
        promiseWrap1.resolve(1);
        promiseWrap4.reject(4);
        Promise.all([promiseWrap1.promise, promiseWrap2.promise, promiseWrap3.promise, s2.absorber({key: Promise.reject()})]).then(() => {
            expect(s.outValues).toEqual([{key: promiseWrap1.promise}, {key: promiseWrap2.promise}, {key: promiseWrap3.promise}, {key: promiseWrap4.promise}]);
            expect(s2.outValues).toEqual([{key: 1}, {key: 2}, {key: 3}]);
            done();
        });
    });

    let createPromise = () => {
        let resolve, reject;
        let promise = new Promise((resolv, rejec) => {
            resolve = resolv;
            reject = rejec;
        });
        return {promise, resolve, reject};
    };
});
