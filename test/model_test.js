'use strict';

// import the mongoose helper utilities
var utils = require('./utils');
var should = require('should');
var request = require('request');
var fs = require('fs');
var csv = require('csv');

// import our User mongoose model
var User = require('../models/user').User;

describe('User: models', function () {

    describe('#create()', function (done) {
        it('should create a new User', function (done) {
            // Create a User object to pass to User.create()
            var u = {
                id: 'xxx',
                password: 'aaa',
                stu_id: '148x222x',
                first_name: 'Satoshi',
                last_name: 'Takatori',
                nick_name: 'tori',
                sex: 'male',
                birthday: '2000/1/1',
                group: 'M1',
                tel: '000-000-000',
                mobile_tel: '111-111-111',
                email: 'takatori@ws.cs.kobe-u.ac.jp',
                addr: 'aaaaa',
                home_addr: 'bbbbb',
                icon_img: 'zzzzz'
            };

            User.create(u, function (err, createdUser) {
                // Confirm that an error does not exist
                should.not.exist(err);
                // verify that the returned user is what we expect
                createdUser.id.should.equal('xxx');
                createdUser.password.should.equal('aaa');
                createdUser.stu_id.should.equal('148x222x');
                createdUser.first_name.should.equal('Satoshi');
                createdUser.last_name.should.equal('Takatori');
                createdUser.nick_name.should.equal('tori');
                createdUser.sex.should.equal('male');
                createdUser.birthday.should.equal('2000/1/1');
                createdUser.group.should.equal('M1');
                createdUser.tel.should.equal('000-000-000');
                createdUser.mobile_tel.should.equal('111-111-111');
                createdUser.email.should.equal('takatori@ws.cs.kobe-u.ac.jp');
                createdUser.addr.should.equal('aaaaa');
                createdUser.home_addr.should.equal('bbbbb');
                createdUser.icon_img.should.equal('zzzzz');
                // Call done to tell mocha that we are done with this test
                done();
            });

            
        });
    });

});






