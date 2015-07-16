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
    utils.disconnectDB();
    done();
});


// 全ユーザを取得
describe('/users', function () {
    
    //DB初期化
    afterEach(function(done){
        User.remove({}, function(){
            done();
        });
    });
    
    describe('#get() - 正常系', function(){        
        // テストデータ投入
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

        // 正常
        it('respond with json', function(done){
            req.get('/apis/users')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res){
                    if (err) done(err);
                    else {
                        res.body.should.have.length(4);
                        done();                      
                    }
                });
        });

    });


    describe('#get() - ユーザ数0', function(){
        
        it('should return [] when not exist user', function(done) {
            req.get('/apis/users')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res){
                    if (err) done(err);
                    else {
                        res.body.should.have.length(0);
                        done();                      
                    }
                });                
        });
    });
    
});

