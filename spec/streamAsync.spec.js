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
        s.write(promise1);
        s.write(promise2);
        s.write(promise3);
        Promise.all([promise1, promise2, promise3]).then(() => {
            expect(s.outValues).toEqual([promise1, promise2, promise3]);
            expect(s2.outValues).toEqual([1, 2, 3]);
            done();
        });
    });
});
