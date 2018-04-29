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
        expect(spy2).toHaveBeenCalledTimes(3);
        expect(spy2).toHaveBeenCalledWith(10, 0);
        expect(spy2).toHaveBeenCalledWith(11, 1);
        expect(spy2).toHaveBeenCalledWith(12, 2);
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

    it('filterCount', () => {
        let s2 = s.filterCount(2);
        s.write(10);
        s.write(11);
        s.write(12);
        s.write(13);
        expect(s.outValues).toEqual([10, 11, 12, 13]);
        expect(s2.outValues).toEqual([10, 11]);
    });

    it('filterIndex', () => {
        let s2 = s.filterIndex([1, 2]);
        s.write(10);
        s.write(11);
        s.write(12);
        s.write(13);
        expect(s.outValues).toEqual([10, 11, 12, 13]);
        expect(s2.outValues).toEqual([11, 12]);
    });

    it('unique', () => {
        let s2 = s.unique();
        s.write(1, 2, 3, 4, 2, 4, 3, 4, 5, 3, 1, 5, 6, 6);
        expect(s.outValues).toEqual([1, 2, 3, 4, 2, 4, 3, 4, 5, 3, 1, 5, 6, 6]);
        expect(s2.outValues).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('pluck', () => {
        let s2 = s.pluck('key');
        s.write({key: 'value1'});
        s.write({key: 'value2'});
        s.write({key: 'value3'});
        s.write({key: 'value4'});
        expect(s.outValues).toEqual([{key: 'value1'}, {key: 'value2'}, {key: 'value3'}, {key: 'value4'}]);
        expect(s2.outValues).toEqual(['value1', 'value2', 'value3', 'value4']);
    });

    it('wrap', () => {
        let s2 = s.wrap('key');
        s.write('value1', 'value2', 'value3', 'value4');
        expect(s.outValues).toEqual(['value1', 'value2', 'value3', 'value4']);
        expect(s2.outValues).toEqual([{key: 'value1'}, {key: 'value2'}, {key: 'value3'}, {key: 'value4'}]);
    });

    it('set', () => {
        let s2 = s.set('sum', (value, index) => value.number + index);
        s.write({number: 10});
        s.write({number: 20});
        s.write({number: 30});
        s.write({number: 40});
        expect(s.outValues).toEqual([{number: 10, sum: 10}, {number: 20, sum: 21}, {number: 30, sum: 32}, {number: 40, sum: 43}]);
        expect(s2.outValues).toEqual([{number: 10, sum: 10}, {number: 20, sum: 21}, {number: 30, sum: 32}, {number: 40, sum: 43}]);
    });

    it('flatten', () => {
        let s2 = s.flatten();
        s.write([10, 11, 12, 13, 14]);
        s.write([20, 21, 22, 23, 24]);
        s.write([30, 31, 32, 33, 34]);
        s.write([40, 41, 42, 43, 44]);
        expect(s.outValues).toEqual([[10, 11, 12, 13, 14], [20, 21, 22, 23, 24], [30, 31, 32, 33, 34], [40, 41, 42, 43, 44]]);
        expect(s2.outValues).toEqual([10, 11, 12, 13, 14, 20, 21, 22, 23, 24, 30, 31, 32, 33, 34, 40, 41, 42, 43, 44]);
    });

    it('flattenOn', () => {
        let s2 = s.flattenOn('names', 'name');
        s.write({type: 'cat', 'class': 'mammalia', names: ['kitty', 'cupcake']});
        s.write({type: 'dog', 'class': 'mammalia', names: ['barf', 'brownNose']});
        expect(s.outValues).toEqual([
            {type: 'cat', 'class': 'mammalia', names: ['kitty', 'cupcake']},
            {type: 'dog', 'class': 'mammalia', names: ['barf', 'brownNose']}]);
        expect(s2.outValues).toEqual([
            {type: 'cat', class: 'mammalia', name: 'kitty'},
            {type: 'cat', class: 'mammalia', name: 'cupcake'},
            {type: 'dog', class: 'mammalia', name: 'barf'},
            {type: 'dog', class: 'mammalia', name: 'brownNose'}]);
    });
});
