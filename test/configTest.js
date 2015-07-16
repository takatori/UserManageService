'use strict';

// import the mongoose helper utilities
var utils = require('./utils.js');
var should = require('should');
var request = require('request');
var fs = require('fs');
var csv = require('csv');

var supertest = require('supertest');
var app = require('../app');
var req = supertest(app);


// import our User mongoose model
var User = require('../models/user').User;

// DB接続
before(function(done){
    utils.connectDB()
        .catch(function(err){
            console.log(err);
            done(err);
        });
    done();
});


// DB接続解除
after(function(done){
    done();
    utils.disconnectDB();
});


describe('config', function () {
    // テストユーザ投入
    before(function(done){
        utils.loadTestData('user.csv')
            .then(utils.setTestData)
            .then(function(){
                done();                    
            })
            .catch(function(err){
                console.log(err);
                done(err);
            });
    });

    //クリーン
    after(function(done){
        User.remove({}, function(){
            done();
        });
    });


    /**
     * xxx1の設定情報を追加
     */
    describe('#post', function(){
        it('should be able to add user config', function(done){
            req.post('/apis/users/xxx1/configs')
                .expect(200)
                .end(function(err, res){
                    if (err) done(err);
                    else {
                        console.log(res);
                        done();                      
                    }
                });
        });
    });

    describe('#get', function(){
        it('should get user config', function(done){
            req.get('/apis/users/xxx1/configs')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res){
                    if (err) done(err);
                    else {
                        console.log(res.text);
                        done();                      
                    }
                });
        });
    });

    
    
});
    
