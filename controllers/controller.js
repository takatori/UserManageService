'use strict';
// import our User mongoose model
var User = require('../models/user').User;
var request = require('request');
// my class
var controller = {};



/**
 *
 */
controller.fetchUserPromise = function(query, filter) {
    return new Promise(function (resolve, reject) {
        User.findOne(query, filter, function(err, user) {
            if (err){
                reject(new Error(err));
            } else {
                console.log(user);
                resolve(user);
            }
        });
    });
};


controller.fetchUserListPromise = function(query, filter) {
    return new Promise(function (resolve, reject) {
        User.find(query, filter, function(err, users) {
            if (err){
                reject(new Error(err));
            } else {
                resolve(users);
            }
        });
    });
};

controller.fetchUserRandomPromise = function(query, filter) {
    return new Promise(function (resolve, reject) {
        User.findOneRandom(query, filter, function(err, user) {
            if (err){
                reject(new Error(err));
            } else {
                resolve(user);
            }
        });
    });    
};

controller.createUserPromise = function(userData) {
    return new Promise(function (resolve, reject) {
        User.create(userData, function(err) {
            if (err) {
                reject(new Error(err));
            } else {
                resolve();
            }
        });
    });
};

controller.updateUserPromise = function(userId, userData) {
    return new Promise(function (resolve, reject) {
        User.update({id: userId}, userData, function(err){
            if (err) {
                reject(new Error(err));
            } else {
                resolve();
            }            
        });
    });
};

controller.deleteUserPromise = function(userId) {
    return new Promise(function (resolve, reject) {
        User.remove({id: userId}, function(err){
            if (err) {
                reject(new Error(err));
            } else {
                resolve();
            }            
        });
    });
};


// 進級処理
controller.promotion = function(grade) {

    switch(grade){
    case 'B4':
        grade = 'M1';
        break;
    case 'M1':
        grade = 'M2';                
        break;
    case 'M2':
        grade = 'D1';                                
        break;
    case 'D1':
        grade = 'D2';                                                
        break;
    case 'D2':
        grade = 'D3';                                                                
        break;
    case 'D3':
        break;
    default:
        break;
    }
    return grade;
};


/**
 * ユーザの設定情報を検索する
 * @param {Object} user
 * @param {Object} queryies ex: {}
 * @return {[String]} value
 */
controller.searchConfigs = function(user, queries) {
    
    var value = [];
    for (var i = 0; i < user.configs.length; i++) {
        if (controller.isContainAllQueries(user.configs[i].tags, queries)) {
            value.push(user.configs[i].value);                   
        }
    }
    return value;
};

/**
 * 指定されたtagの中にqueriesの要素がすべてあればtrue,なければfalseを返す
 * @param {Object} tags 
 * @param {Object} queries
 * @return boolean 
 */
controller.isContainAllQueries = function(tags, queries) {
    for (var i = 0; i < queries.length; i++) {
        if (tags.indexOf(queries[i].toString()) < 0) return false;
    }
    return true;
};


controller.addConfigPromise = function(query, config) {
    controller.fetchUserPromise(query, {})
        .then(function(user){
            user.configs.push({ tags : config.tags, value : config.value });
            user.save(function (err) {
                if (err) {
                    throw new Error(err);
                } 
            });
        });
};



/**
 * UserManagerを購読しているAPIを取得する
 */
controller.fetchSubscriber = function() {
    return new Promise(function (resolve, reject) {
        
    });
};

controller.publishPromis = function(url) {
    return new Promise(function (resolve, reject) {
       request.get(url, function(err, response, body) {
           if (!err && response.statusCode == 200) {
               resolve();
           } else {
               reject(new Error(err));
           }
       });
    });
};




module.exports = controller;
