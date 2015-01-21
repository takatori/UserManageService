// user model 
'use strict';

var config = require('../config');
var mongoose = require('mongoose');

// ensure the NODE_ENV is set to 'test'
// this is helpful when you would like to change behavior when testing
process.env.NODE_ENV = 'test';

// 各テストごとの始まる前の処理
beforeEach(function (done) {

    function clearDB() {
        for (var i in mongoose.connection.collections) {
            mongoose.connection.collections[i].remove(function() {});
        }
        return done();
    }
    
    // mongoose.connection.readyState
    // 0 = disconnected
    // 1 = connected
    // 2 = disconnecting
    if (mongoose.connection.readyState === 0) {
        mongoose.connect(config.db.test, function (err) {
            if (err) {
                throw err;
            }
            return clearDB();
        });
    } else {
        return clearDB();
    }
});


// 各テストごとの終わった後の処理
afterEach(function (done) {
    mongoose.models = {};
    mongoose.modelSchemas = {};
    mongoose.disconnect();
    return done();
});


