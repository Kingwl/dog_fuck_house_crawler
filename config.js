let mongoose = require('mongoose');

module.exports = function () {
    mongoose.Promise = global.Promise;

    mongoose.connect('mongodb://localhost/HouseDB', err => {
        if (err) {
            console.log('connect database error -->', err);
            process.exit(10601);
        }
        console.log('connect database success');
    });
}