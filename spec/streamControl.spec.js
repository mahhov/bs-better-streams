const stream = require('../src/index.js');

describe('control', () => {
    let s, spy1, spy2, spy3;

    beforeEach(() => {
        s = stream();
        spy1 = jasmine.createSpy('spy1');
        spy2 = jasmine.createSpy('spy2');
        spy3 = jasmine.createSpy('spy3');
    });

    it('to', () => {
        let s2 = stream();
        s.write(10);
        s.write(11);
        s2.write(12);
        s2.write(13);
        s.to(s2);
        s.write(14);
        s.write(15);
        s2.write(16);
        s2.write(17);
        expect(s.outValues).toEqual([10, 11, 14, 15]);
        expect(s2.outValues).toEqual([12, 13, 10, 11, 14, 15, 16, 17]);
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

    it('if', () => {
        let ifStreams = s.if(value => value < 15);
        s.write(12, 16, 14, 13, 17, 15);
        expect(s.outValues).toEqual([12, 16, 14, 13, 17, 15]);
        expect(ifStreams.then.outValues).toEqual([12, 14, 13]);
        expect(ifStreams.else.outValues).toEqual([16, 17, 15]);
    });

    it('group', () => {
        let s2 = s.group(value => value % 3);
        let s3 = s.group(value => value % 2 + 'x');
        s.write(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
        expect(s.outValues).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        expect(s2[0].outValues).toEqual([0, 3, 6, 9]);
        expect(s2[1].outValues).toEqual([1, 4, 7]);
        expect(s2[2].outValues).toEqual([2, 5, 8]);
        expect(s3['0x'].outValues).toEqual([0, 2, 4, 6, 8]);
        expect(s3['1x'].outValues).toEqual([1, 3, 5, 7, 9]);
    });

    it('groupCount', () => {
        let s2 = s.groupCount(3);
        s.write(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
        expect(s.outValues).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        expect(s2.group0.outValues).toEqual([0, 1, 2]);
        expect(s2.group1.outValues).toEqual([3, 4, 5]);
        expect(s2.group2.outValues).toEqual([6, 7, 8]);
        expect(s2.group3.outValues).toEqual([9]);
    });

    it('groupFirstCount', () => {
        let s2 = s.groupFirstCount(4);
        s.write(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
        expect(s.outValues).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        expect(s2.first.outValues).toEqual([0, 1, 2, 3]);
        expect(s2.rest.outValues).toEqual([4, 5, 6, 7, 8, 9]);
    });

    it('groupNCount', () => {
        let s2 = s.groupNCount(3, 2);
        s.write(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
        expect(s.outValues).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        expect(s2.group0.outValues).toEqual([0, 1, 2]);
        expect(s2.group1.outValues).toEqual([3, 4, 5]);
        expect(s2.rest.outValues).toEqual([6, 7, 8, 9]);
    });

    it('groupIndex', () => {
        let s2 = s.groupIndex([0, 5, 6], [1, 4, 7], [2, 8]);
        s.write(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
        expect(s.outValues).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        expect(s2[0].outValues).toEqual([0, 5, 6]);
        expect(s2[1].outValues).toEqual([1, 4, 7]);
        expect(s2[2].outValues).toEqual([2, 8]);
        expect(s2.rest.outValues).toEqual([3, 9]);
    });

    it('batch', () => {
        let s2 = s.batch(3);
        s.write(0, 1, 2, 3, 4, 5, 6, 7);
        expect(s.outValues).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
        expect(s2.outValues).toEqual([[0, 1, 2], [3, 4, 5]]);
    });

    fit('throttle', () => {
        let s2 = s.throttle(2);
        s.write(1, 2, 3, 4, 5, 6, 7);
        s2.stream
            .each(spy1);
        expect(spy1.calls.allArgs()).toEqual([[1, 0], [2, 1]]);
        spy1.calls.reset();
        s2.next();
        expect(spy1.calls.allArgs()).toEqual([[3, 2]]);
        spy1.calls.reset();
        s2.next(2);
        expect(spy1.calls.allArgs()).toEqual([[4, 3], [5, 4]]);
        spy1.calls.reset();
        s2.next(3);
        expect(spy1.calls.allArgs()).toEqual([[6, 5], [7, 6]]);
    });
});
