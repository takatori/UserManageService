// user model 
'use strict';

var config = require('../config');
var mongoose = require('mongoose');
var fs = require('fs');
var csv = require('csv');
// import our User mongoose model
var User = require('../models/user').User;

// my class
var utils = {};

// ensure the NODE_ENV is set to 'test'
// this is helpful when you would like to change behavior when testing
process.env.NODE_ENV = 'test';

// // すべてのテストが始まる前の処理
// before(function(done){
//     // DB接続
//     //utils.connectDB(done); //Mochaはdone()が実行されるまで待つ
//     //done();
// });

// // 各テスト(describe)ごとの始まる前の処理
// beforeEach(function (done) {
//     // DBリセット
//     utils.clearDB(done);
// });

// // 各テストごとの終わった後の処理
// afterEach(function (done) {
//     utils.clearDB(done);
// });

// // すべてのテストが終わった後の処理
// after(function(done){
//     utils.disconnectDB(done);    
// });



/**
 * DB接続
 */
utils.connectDB = function () {
    return new Promise(function(resolve, reject){
        // mongoose.connection.readyState
        // 0 = disconnected
        // 1 = connected
        // 2 = disconnecting
        if (mongoose.connection.readyState === 0) {
            mongoose.connect(config.db.test, function (err) {
                if (err) reject(new Error(err));
            });
        }
        resolve();
    });
};


/**
 * DBからドキュメントを削除する
 */
utils.clearDB = function() {
    for (var i in mongoose.connection.collections) {
        mongoose.connection.collections[i].remove(function() {
        });
    }
};


/**
 * DBの接続を切る
 */    
utils.disconnectDB = function() {
    mongoose.models = {};
    mongoose.modelSchemas = {};
    mongoose.disconnect();
};


/**
 * csv形式のテストデータをロードする
 */
utils.loadTestData = function(filename){
    return new Promise(function(resolve, reject){
        var testData = fs.readFileSync(__dirname + '/testData/' + filename, 'utf-8');
        csv.parse(testData, {columns: true}, function(err, data){
            if (err) reject(new Error(err));
            else resolve(data);
        });
    });
};

/**
 * DBにテストデータをセットする
 */
utils.setTestData = function(data){
    return new Promise(function(resolve, reject){
        data.forEach(function(user){
            User.create(user, function(err){
                if(err) reject(new Error(err));
            });
        });
        resolve();
    });
};

module.exports = utils;
