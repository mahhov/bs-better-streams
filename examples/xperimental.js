const Stream = require('../src/Stream');

let getUserShape = userId => {
    return Promise.resolve(userId === 1 ? 'circle' : 'square');
};
let users = new Stream();
users.write({userId: '1', height: 3, color: 'blue'}, {userId: '2', height: 4, color: 'green'}, {userId: '3', height: 2, color: 'orange'});

users
    .set('shape', ({userId}) => getUserShape(userId))
    .map(user => user.shape.then(shape => {
        user.shape = shape;
        return user;
    }))
    .wait()
    .each(console.log);

users
    .set('shape', ({userId}) => getUserShape(userId))
    .waitOn('shape');

