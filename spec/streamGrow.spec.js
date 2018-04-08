const stream = require('../src/index.js');

describe('grow', () => {
    let s, spy1, spy2, spy3;

    beforeEach(() => {
        s = stream();
        spy1 = jasmine.createSpy('spy1');
        spy2 = jasmine.createSpy('spy2');
        spy3 = jasmine.createSpy('spy3');
    });

    it('repeat', () => {
        let s2 = s.repeat(value => value);
        s.write(2);
        s.write(3);
        s.write(4);
        expect(s.outValues).toEqual([2, 3, 4]);
        expect(s2.outValues).toEqual([2, 2, 3, 3, 3, 4, 4, 4, 4]);
    });

    it('repeatCount', () => {
        let s2 = s.repeatCount(2);
        s.write(2);
        s.write(3);
        s.write(4);
        expect(s.outValues).toEqual([2, 3, 4]);
        expect(s2.outValues).toEqual([2, 2, 3, 3, 4, 4]);
    });

    it('generate', () => {
        s.write(10, 100, 500);
        let s2 = s.generate(value => [value * 2, value * 3]);
        expect(s.outValues).toEqual([10, 100, 500]);
        expect(s2.outValues).toEqual([10, 20, 30, 100, 200, 300, 500, 1000, 1500]);
    });
    
    it('mapMultiple', function() {
        s.write(10, 100, 500);
        let s2 = s.mapMultiple(value => [value * 2, value * 3]);
        expect(s.outValues).toEqual([10, 100, 500]);
        expect(s2.outValues).toEqual([20, 30, 200, 300, 1000, 1500]);
    });
});
