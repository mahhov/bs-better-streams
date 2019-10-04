const stream = require('../src/index.js');

describe('object', () => {
    it('clean', () => {
        let s = stream();
        let s2 = s.map(a => a);
        s.write(1, 2, 3, 4);
        s.clean();
        s.write(5, 6, 7, 8);
        let s3 = s.map(a => a);

        expect(s.outValues).toEqual([5, 6, 7, 8]);
        expect(s2.outValues).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
        expect(s3.outValues).toEqual([5, 6, 7, 8]);
    });

    it('disconnect', () => {
        let s = stream();
        let s2 = s.map(a => a);
        s.write(1, 2, 3, 4);
        s.disconnect();
        s.write(5, 6, 7, 8);
        let s3 = s.map(a => a);

        expect(s.outValues).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
        expect(s2.outValues).toEqual([1, 2, 3, 4]);
        expect(s3.outValues).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    });
});
