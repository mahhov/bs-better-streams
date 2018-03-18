// const b_ = require('../src/index.js');
//
// describe('b_', () => {
//     describe('additional methods', () => {
//      
//
//         describe('#repeat', () => {
//             it('should replace each element with a list containing that element repeated `n` times', () => {
//                 let list = b_([1, 2, 3]);
//                 list = list.repeat(3);
//                 expect(list.value).toEqual([[1, 1, 1], [2, 2, 2], [3, 3, 3]]);
//             });
//         });
//
//         describe('#field', () => {
//             it('should return named field as a B_ object', () => {
//                 let obj = b_({dog: 3});
//                 expect(obj.field('dog').value).toEqual(3);
//             });
//         });
//
//         describe('#asList', () => {
//             it('should invoke the handler function once with the value of the B_ object', () => {
//                 let list = b_([1, 2, 3]);
//                 let handler = jasmine.createSpy('handler').and.returnValue('return');
//                 expect(list.asList(handler)).toEqual('return');
//                 expect(handler).toHaveBeenCalledTimes(1);
//                 expect(handler).toHaveBeenCalledWith([1, 2, 3]);
//             });
//         });
//
//         describe('#unwrap', () => {
//             it('should return the B_ object as js array', () => {
//                 let list = b_([1, 2, 3]);
//                 expect(list.unwrap()).toEqual([1, 2, 3]);
//             });
//         });
//
//         describe('#length', () => {
//             it('should return the length of the value of the B_ object', () => {
//                 expect(b_([1, 2, 3]).length).toEqual(3);
//             });
//         });
//     });
//
//     describe('if', () => {
//         it('overview', function () {
//             let result = b_([1, 2, 3, 4, 5, 6])
//                 .if(x => x > 2)
//                 .then(b_ =>
//                     b_.map(x => x + 1))
//                 .else(b_ => b_
//                     .map(x => x + 5))
//                 .done()
//                 .map(x => x * 10);
//             expect(result.value).toEqual([40, 50, 60, 70, 60, 70]);
//         });
//     });
// });
