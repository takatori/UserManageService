// user model 
'use strict';

var config = require('../config');
var mongoose = require('mongoose');
var fs = require('fs');
var csv = require('csv');
// import our User mongoose model
var User = require('../models/user').User;


// ensure the NODE_ENV is set to 'test'
// this is helpful when you would like to change behavior when testing
process.env.NODE_ENV = 'test';


// 各テストごとの始まる前の処理
beforeEach(function (done) {
    // DB接続
    connectDB();
    // DBリセット
    clearDB(done);

    setTestData();
});


// 各テストごとの終わった後の処理
afterEach(function (done) {
    mongoose.models = {};
    mongoose.modelSchemas = {};
    mongoose.disconnect();
    return done();
});


/**
 * DB接続
 */
function connectDB() {
    // mongoose.connection.readyState
    // 0 = disconnected
    // 1 = connected
    // 2 = disconnecting
    if (mongoose.connection.readyState === 0) {
        mongoose.connect(config.db.test, function (err) {
            if (err) {
                throw err;
            }
        });
    }
}


/**
 * DBをuser.csvファイルのデータで初期化
 */
function setTestData(){
    var rs = fs.createReadStream(__dirname + '/user.csv'); //'./user.csv'だとエラー./がプロジェクトルートになる
    var parser = csv.parse({columns: true}, function(err, data){
        console.log(data);
        data.forEach(function(user){
            User.create(user, function(err){
                if (err) console.log(err);
            });
        });
    });
    rs.pipe(parser);
}

/**
 * DBからドキュメントを削除する
 */
function clearDB(done) {
    for (var i in mongoose.connection.collections) {
        mongoose.connection.collections[i].remove(function() {});
    }
    return done();    
}

