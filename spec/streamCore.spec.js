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

    it('uniqueOn', () => {
        let s2 = s.uniqueOn('key');
        s.write(
            {key: 1, key2: 10},
            {key: 2, key2: 20},
            {key: 3, key2: 30},
            {key: 4, key2: 40},
            {key: 2, key2: 21},
            {key: 4, key2: 41},
            {key: 3, key2: 31},
            {key: 4, key2: 42},
            {key: 5, key2: 50},
            {key: 3, key2: 32},
            {key: 1, key2: 11},
            {key: 5, key2: 51},
            {key: 6, key2: 60},
            {key: 6, key2: 61});
        expect(s.outValues).toEqual([
            {key: 1, key2: 10},
            {key: 2, key2: 20},
            {key: 3, key2: 30},
            {key: 4, key2: 40},
            {key: 2, key2: 21},
            {key: 4, key2: 41},
            {key: 3, key2: 31},
            {key: 4, key2: 42},
            {key: 5, key2: 50},
            {key: 3, key2: 32},
            {key: 1, key2: 11},
            {key: 5, key2: 51},
            {key: 6, key2: 60},
            {key: 6, key2: 61}]);
        expect(s2.outValues).toEqual([
            {key: 1, key2: 10},
            {key: 2, key2: 20},
            {key: 3, key2: 30},
            {key: 4, key2: 40},
            {key: 5, key2: 50},
            {key: 6, key2: 60},]);
    });

    it('uniqueX', () => {
        let s2 = s.uniqueX(value => value.key + value.key2);
        s.write(
            {key: 4, key2: 0},
            {key: 0, key2: 4},
            {key: 2, key2: 2},
            {key: 3, key2: 2},
            {key: 1, key2: 4},
            {key: 4, key2: 0});
        expect(s.outValues).toEqual([
            {key: 4, key2: 0},
            {key: 0, key2: 4},
            {key: 2, key2: 2},
            {key: 3, key2: 2},
            {key: 1, key2: 4},
            {key: 4, key2: 0}]);
        expect(s2.outValues).toEqual([
            {key: 4, key2: 0},
            {key: 3, key2: 2},]);
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

    it('pick', () => {
        let s2 = s.pick('key1', 'key2');
        s.write({key1: 'value11', key2: 'value21', key3: 'value31', key4: 'value41'});
        s.write({key1: 'value12', key2: 'value22', key3: 'value32', key4: 'value42'});
        s.write({key1: 'value13', key2: 'value23', key3: 'value33', key4: 'value43'});
        s.write({key1: 'value14', key2: 'value24', key3: 'value34', key4: 'value44'});
        expect(s.outValues).toEqual([
            {key1: 'value11', key2: 'value21', key3: 'value31', key4: 'value41'},
            {key1: 'value12', key2: 'value22', key3: 'value32', key4: 'value42'},
            {key1: 'value13', key2: 'value23', key3: 'value33', key4: 'value43'},
            {key1: 'value14', key2: 'value24', key3: 'value34', key4: 'value44'}]);
        expect(s2.outValues).toEqual([
            {key1: 'value11', key2: 'value21'},
            {key1: 'value12', key2: 'value22'},
            {key1: 'value13', key2: 'value23'},
            {key1: 'value14', key2: 'value24'}]);
    });

    it('omit', () => {
        let s2 = s.omit('key3', 'key4');
        s.write({key1: 'value11', key2: 'value21', key3: 'value31', key4: 'value41'});
        s.write({key1: 'value12', key2: 'value22', key3: 'value32', key4: 'value42'});
        s.write({key1: 'value13', key2: 'value23', key3: 'value33', key4: 'value43'});
        s.write({key1: 'value14', key2: 'value24', key3: 'value34', key4: 'value44'});
        expect(s.outValues).toEqual([
            {key1: 'value11', key2: 'value21', key3: 'value31', key4: 'value41'},
            {key1: 'value12', key2: 'value22', key3: 'value32', key4: 'value42'},
            {key1: 'value13', key2: 'value23', key3: 'value33', key4: 'value43'},
            {key1: 'value14', key2: 'value24', key3: 'value34', key4: 'value44'}]);
        expect(s2.outValues).toEqual([
            {key1: 'value11', key2: 'value21'},
            {key1: 'value12', key2: 'value22'},
            {key1: 'value13', key2: 'value23'},
            {key1: 'value14', key2: 'value24'}]);
    });

    it('set', () => {
        let s2 = s.set('sum', (value, index) => value.number + index);
        s.write({number: 10});
        s.write({number: 20});
        s.write({number: 30});
        s.write({number: 40});
        expect(s.outValues).toEqual([{number: 10, sum: 10}, {number: 20, sum: 21}, {number: 30, sum: 32}, {
            number: 40,
            sum: 43
        }]);
        expect(s2.outValues).toEqual([{number: 10, sum: 10}, {number: 20, sum: 21}, {number: 30, sum: 32}, {
            number: 40,
            sum: 43
        }]);
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
