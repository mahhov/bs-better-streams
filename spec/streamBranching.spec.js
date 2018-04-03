const stream = require('../src/index.js');

describe('branching', () => {
    let s, spy1, spy2, spy3;

    beforeEach(() => {
        s = stream();
        spy1 = jasmine.createSpy('spy1');
        spy2 = jasmine.createSpy('spy2');
        spy3 = jasmine.createSpy('spy3');
    });

    it('join', () => {
        let s2 = stream();
        s.write(10);
        s.write(11);
        s2.write(12);
        s2.write(13);
        let s3 = s.join(s2);
        s.write(14);
        s.write(15);
        s2.write(16);
        s2.write(17);
        expect(s.outValues).toEqual([10, 11, 14, 15]);
        expect(s2.outValues).toEqual([12, 13, 16, 17]);
        expect(s3.outValues).toEqual([10, 11, 12, 13, 14, 15, 16, 17]);
    });
});
