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

    it('product', () => {
        let s2 = stream();
        let s3 = s.product(s2, 'id', 'id2', 'match');
        s.write({id: 1, value: 100});
        s.write({id: 2, value: 200});
        s.write({id: 2, value: 201});
        s.write({id: 3, value: 300});
        s.write({id: 4, value: 400});
        s.write({id: 6, value: 600});
        s.write({id: 6, value: 601});
        s2.write({id2: 1, value: 10});
        s2.write({id2: 2, value: 20});
        s2.write({id2: 3, value: 30});
        s2.write({id2: 3, value: 31});
        s2.write({id2: 5, value: 50});
        s2.write({id2: 6, value: 60});
        s2.write({id2: 6, value: 61});

        expect(s.outValues).toEqual([
            {id: 1, value: 100},
            {id: 2, value: 200},
            {id: 2, value: 201},
            {id: 3, value: 300},
            {id: 4, value: 400},
            {id: 6, value: 600},
            {id: 6, value: 601},
        ]);
        expect(s2.outValues).toEqual([
            {id2: 1, value: 10},
            {id2: 2, value: 20},
            {id2: 3, value: 30},
            {id2: 3, value: 31},
            {id2: 5, value: 50},
            {id2: 6, value: 60},
            {id2: 6, value: 61}
        ]);
        expect(s3.outValues).toEqual([
            {id: 1, value: 100, match: {id2: 1, value: 10}},
            {id: 2, value: 200, match: {id2: 2, value: 20}},
            {id: 2, value: 201, match: {id2: 2, value: 20}},
            {id: 3, value: 300, match: {id2: 3, value: 30}},
            {id: 3, value: 300, match: {id2: 3, value: 31}},
            {id: 6, value: 600, match: {id2: 6, value: 60}},
            {id: 6, value: 601, match: {id2: 6, value: 60}},
            {id: 6, value: 600, match: {id2: 6, value: 61}},
            {id: 6, value: 601, match: {id2: 6, value: 61}}
        ]);
    });

    it('productX', () => {
        let s2 = stream();
        let s3 = s.productX(s2, ({id, id2}) => id + id2, ({id2, id3}) => id2 - id3, (left, {value}) => {
            left.rightValue = value;
            return left;
        });
        s.write({id: 2, id2: -1, value: 100});
        s.write({id: 4, id2: -2, value: 200});
        s.write({id: 5, id2: -3, value: 201});
        s.write({id: 7, id2: -4, value: 300});
        s.write({id: 9, id2: -5, value: 400});
        s.write({id: 12, id2: -6, value: 600});
        s.write({id: 13, id2: -7, value: 601});
        s2.write({id2: 3, id3: 2, value: 10});
        s2.write({id2: 4, id3: 2, value: 20});
        s2.write({id2: 5, id3: 2, value: 30});
        s2.write({id2: 5, id3: 2, value: 31});
        s2.write({id2: 7, id3: 2, value: 50});
        s2.write({id2: 8, id3: 2, value: 60});
        s2.write({id2: 8, id3: 2, value: 61});

        expect(s.outValues).toEqual([
            {id: 2, id2: -1, value: 100, rightValue: 10},
            {id: 4, id2: -2, value: 200, rightValue: 20},
            {id: 5, id2: -3, value: 201, rightValue: 20},
            {id: 7, id2: -4, value: 300, rightValue: 31},
            {id: 9, id2: -5, value: 400},
            {id: 12, id2: -6, value: 600, rightValue: 61},
            {id: 13, id2: -7, value: 601, rightValue: 61},
        ]);
        expect(s2.outValues).toEqual([
            {id2: 3, id3: 2, value: 10},
            {id2: 4, id3: 2, value: 20},
            {id2: 5, id3: 2, value: 30},
            {id2: 5, id3: 2, value: 31},
            {id2: 7, id3: 2, value: 50},
            {id2: 8, id3: 2, value: 60},
            {id2: 8, id3: 2, value: 61}
        ]);
        expect(s3.outValues).toEqual([
            {id: 2, id2: -1, value: 100, rightValue: 10},
            {id: 4, id2: -2, value: 200, rightValue: 20},
            {id: 5, id2: -3, value: 201, rightValue: 20},
            {id: 7, id2: -4, value: 300, rightValue: 31},
            {id: 7, id2: -4, value: 300, rightValue: 31},
            {id: 12, id2: -6, value: 600, rightValue: 61},
            {id: 13, id2: -7, value: 601, rightValue: 61},
            {id: 12, id2: -6, value: 600, rightValue: 61},
            {id: 13, id2: -7, value: 601, rightValue: 61}
        ]);
    });

    it('if', () => {
        let ifStreams = s.if(value => value < 15);
        s.write(12, 16, 14, 13, 17, 15);
        expect(s.outValues).toEqual([12, 16, 14, 13, 17, 15]);
        expect(ifStreams.then.outValues).toEqual([12, 14, 13]);
        expect(ifStreams.else.outValues).toEqual([16, 17, 15]);
    });

    it('split', () => {
        let s2 = s.split(value => value > 100,
            stream => stream.map(a => a + 100),
            stream => stream.map(a => -a));
        s.write(200, 0, 1, 201, 2, 202);
        expect(s.outValues).toEqual([200, 0, 1, 201, 2, 202]);
        expect(s2.outValues).toEqual([300, -0, -1, 301, -2, 302]);
    });

    it('split optional falseHandler', () => {
        let s2 = s.split(value => value > 100,
            stream => stream.map(a => a + 100));
        s.write(200, 0, 1, 201, 2, 202);
        expect(s.outValues).toEqual([200, 0, 1, 201, 2, 202]);
        expect(s2.outValues).toEqual([300, 0, 1, 301, 2, 302]);
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

    it('batchFlat', () => {
        let s2 = s.batchFlat(3);
        s.write(0);
        expect(s.outValues).toEqual([0]);
        expect(s2.outValues).toEqual([]);
        s.write(1);
        expect(s.outValues).toEqual([0, 1]);
        expect(s2.outValues).toEqual([]);
        s.write(2);
        expect(s.outValues).toEqual([0, 1, 2]);
        expect(s2.outValues).toEqual([[0, 1, 2]]);
        s.write(3);
        expect(s.outValues).toEqual([0, 1, 2, 3]);
        expect(s2.outValues).toEqual([[0, 1, 2]]);
        s.write(4);
        expect(s.outValues).toEqual([0, 1, 2, 3, 4]);
        expect(s2.outValues).toEqual([[0, 1, 2]]);
        s.write(5);
        expect(s.outValues).toEqual([0, 1, 2, 3, 4, 5]);
        expect(s2.outValues).toEqual([[0, 1, 2], [3, 4, 5]]);
        s.write(6);
        expect(s.outValues).toEqual([0, 1, 2, 3, 4, 5, 6]);
        expect(s2.outValues).toEqual([[0, 1, 2], [3, 4, 5]]);
        s.write(7);
        expect(s.outValues).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
        expect(s2.outValues).toEqual([[0, 1, 2], [3, 4, 5]]);
    });

    it('throttle', () => {
        let throttled = s.throttle(2);
        s.write(1, 2, 3, 4, 5, 6, 7);
        throttled.stream.each(spy1);
        expect(spy1.calls.allArgs()).toEqual([[1, 0], [2, 1]]);
        spy1.calls.reset();
        throttled.nextOne();
        expect(spy1.calls.allArgs()).toEqual([[3, 2]]);
        spy1.calls.reset();
        throttled.next(2);
        expect(spy1.calls.allArgs()).toEqual([[4, 3], [5, 4]]);
        spy1.calls.reset();
        throttled.next(3);
        expect(spy1.calls.allArgs()).toEqual([[6, 5], [7, 6]]);
    });

    it('throttle with 0 initial', () => {
        let throttled = s.throttle();
        s.write(1, 2, 3, 4, 5, 6, 7);
        throttled.stream.each(spy1);
        expect(spy1).not.toHaveBeenCalled();
        throttled.next(2);
        expect(spy1.calls.allArgs()).toEqual([[1, 0], [2, 1]]);
        spy1.calls.reset();
        throttled.next();
        expect(spy1.calls.allArgs()).toEqual([[3, 2]]);
        spy1.calls.reset();
        throttled.next(2);
        expect(spy1.calls.allArgs()).toEqual([[4, 3], [5, 4]]);
        spy1.calls.reset();
        throttled.next(3);
        expect(spy1.calls.allArgs()).toEqual([[6, 5], [7, 6]]);
    });

    it('throttle unthrottle', () => {
        let throttled = s.throttle();
        s.write(1, 2, 3, 4, 5, 6, 7);
        throttled.stream.each(spy1);
        expect(spy1).not.toHaveBeenCalled();
        throttled.next(2);
        expect(spy1.calls.allArgs()).toEqual([[1, 0], [2, 1]]);
        spy1.calls.reset();
        throttled.unthrottle();
        expect(spy1.calls.allArgs()).toEqual([[3, 2], [4, 3], [5, 4], [6, 5], [7, 6]]);
        spy1.calls.reset();
        s.write(8);
        expect(spy1.calls.allArgs()).toEqual([[8, 7]]);
        spy1.calls.reset();
        throttled.next(2);
        expect(spy1).not.toHaveBeenCalled();
        spy1.calls.reset();
        s.write(9, 10, 11);
        expect(spy1.calls.allArgs()).toEqual([[9, 8], [10, 9], [11, 10]]);
    });
});
