/*
 * @fileoverview メンバー情報管理システムAPI
 * @author Satoshi Takatori
 */

var express = require('express');
var router = express.Router();
var User = require('../models/user').User;
var config = require('../config');
var request = require('request');
var fs = require('fs');


/**
 * 全ユーザの情報を返す
 * @return{[User]}
 */
router.get('/users', function(req, res, next) {
    fetchUserListPromise({}, {})
        .then(function(users){
            res.status(200).json(users);            
        })
        .catch(function(err){
            res.status(500).json(err);            
        });
});


/**
 * 現役のユーザーの情報で指定した属性のみを返す
 * @param {String} filter 属性情報 ex: filter=first_name,last_name
 * @return {[User]}
 */
router.get('/users/current', function(req, res, next) {

    var query = { group: { $in : config.current }};
    var filter = {};

    // filter作成
    var fields = req.query.fields;
    if (fields) {
        fields = fields.split(',');
        fields.forEach(function(f){
            filter[f] = 'true';
        });        
    }
    
    fetchUserListPromise(query, filter)
        .then(function(users){
            res.status(200).json(users);            
        })
        .catch(function(err){
            res.status(500).json(err);            
        });
});


/**
 * 指定されたidのユーザ情報を返す
 * @param {String} id
 * @return {Object} user ユーザ情報
 */
router.get('/users/:id', function(req, res) {

    var query = {id: req.params.id};
    fetchUserPromise(query,{})
        .then(function(user){
            res.status(200).json(user);                        
        })
        .catch(function(err){
            res.status(500).json(err);                        
        });
});

/**
 * 新規ユーザを登録する
 * @param {Object}  ユーザ情報
 */
router.post('/users', function(req, res, next) {
    console.log(req.body);
    var userData = req.body;

    createUserPromise(userData)
        .then(function(){
            res.status(200).json('succeed in create user');                        
        })
        .catch(function(err){
            res.status(500).json(err);                        
        });
});


/**
 * ユーザ情報を更新する
 * @param {String} id
 * @param {Object} ユーザ情報
 */
router.post('/users/:id', function(req, res, next) {
    console.log(req.body);
    var userId = req.params.id;    
    var userData = req.body;

    updateUserPromise(userId, userData)
        .then(function(){
            res.status(200).json('succeed in udpate user');            
        })
        .catch(function(err){
            res.status(500).json(err);                        
        });    
});


/**
 * ユーザを削除する
 * @param {String} id
 */
router.delete('/users/:id', function(req, res, next) {
    var userId = req.params.id;
    
    deleteUserPromise(userId)
        .then(function(){
            res.status(200).json('succeed in delete user');            
        })
        .catch(function(err){
            res.status(500).json(err);                        
        });        
});


/**
 * 学生からランダムに一人取り出す
 * @return {Object} user ユーザ情報 ex: {last_name:Takatori, first_name:Satoshi, nick_name: tori}
 */
router.get('/users/students/random', function (req, res, next) {

    var query = { group: { $in : config.student }};
    var filter = { last_name:1, first_name:1, nick_name:1 };

    fetchUserRandomPromise(query, filter)
        .then(function(user){
            res.status(200).json(user);            
        })
        .catch(function(err){
            res.status(500);            
        });
});


/**
 * ユーザの所属グループを卒業生に変更する
 * @param {String} id
 */
router.get('/users/:id/graduate', function (req, res, next) {

    var userId = req.params.id;
    var graduationYear = (new Date).getFullYear() + 'Graduates';
    var userData = { group: graduationYear };

    updateUserPromise(userId, userData)
        .then(function(){
            res.status(200).send('succeed in udpate user:' + userData);            
        })
        .catch(function(err) {
            res.status(500).send(err);            
        });
});


/**
 * ユーザの所属グループを現在の学年から一つ上げる
 * @param {String} id
 */
router.get('/users/:id/promotion', function (req, res, next) {

    var userId = req.params.id;
    var query = {id: userId};
    
    fetchUserPromise(query,{})
        .then(function(user){
            if (!user) throw new Error('cannot find user');
            
            var updateData = { group: promotion(user.group)};
            return updateUserPromise(userId, updateData);
        })
        .then(function(){
            res.status(200).send('succeed in udpate user:' + userId);
        })
        .catch(function(err){
            res.status(500).send(err);
        });
});

// 進級処理
function promotion (grade) {

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
}

/**
 * ユーザの設定情報一覧を取得する
 * @param {String} id
 * @return {Object} configs 
 */
router.get('/users/:id/configs', function (req, res, next) {

    var query = {id: req.params.id};
    var filter = {configs: true};
    
    fetchUserPromise(query, filter)
        .then(function(configs){
            res.status(200).json(configs);                        
        })
        .catch(function(err) {
            res.status(500).send(err);                        
        });
});


/**
 * ユーザの設定情報をタグで検索する
 * @param {String} id 
 * @param {[String]} tags ex:['test', 'test2']
 * @return {Object} configs
 */
router.post('/users/:id/configs/search', function (req, res, next) {

    var query  = {id: req.params.id};
    var tags = req.body.tags;    

    fetchUserPromise(query, {})
        .then(function(user){
            if (!user) {
                throw new Error('cannot find user');                
            } else {
                res.status(200).json(searchConfigs(user, tags));
            }
        })
        .catch(function(err){
            res.status(500).send(err);            
        });
});

/**
 * ユーザの設定情報を検索する
 * @param {Object} user
 * @param {Object} queryies ex: {}
 * @return {[String]} value
 */
function searchConfigs(user, queries) {
    var value = [];
    console.log(queries);
    for (var i = 0; i < user.configs.length; i++) {
        if (isContainAllQueries(user.configs[i].tags, queries)) {
            value.push(user.configs[i].value);                   
        }
    }
    return value;
}

/**
 * 指定されたtagの中にqueriesの要素がすべてあればtrue,なければfalseを返す
 * @param {Object} tags 
 * @param {Object} queries
 * @return boolean 
 */
function isContainAllQueries (tags, queries) {
    for (var i = 0; i < queries.length; i++) {
        if (tags.indexOf(queries[i].toString()) < 0) return false;
    }
    return true;
}




/**
 * ユーザの設定情報を新規登録する 
 * @param {String} id
 * @param {Object} config
 */
router.post('/users/:id/configs', function (req, res, next) {
    console.log(req.body);
    var userId = req.params.id;
    var config = req.body;
    
    User.findOne({id: userId}, function(err, user) {
        if (err) {
            res.status(500).json(err);                        
        } else {
            user.configs.push({ tags : config.tags, value : config.value });
            user.save(function (err) {
                if (err) {
                    res.status(500).json(err);                        
                } else {
                    res.status(200).json('succeed in create user config:' + userId);
                }
            });
        }
    });
});


/**
 * ユーザの設定情報を更新する
 * 設定情報のタグを追加する
 * @param {String} id
 * @param {String} configId 
 * @param {String} tag
 */
router.post('/users/:id/configs/:configId/tags', function (req, res, next) {

    console.log(req.body);
    var userId = req.params.id;
    var configId = req.params.configId;
    var config = req.body;

    User.findOne({id: userId}, function(err, user){
        if (err) {
            res.status(500);
        } else {
            for (var i = 0; i < user.configs.length; i++) {
                if (user.configs[i]._id == configId) {
                    user.configs[i].tags.push(config.tags);
                }                
            }
            user.save(function (err) {
                if (err) {
                    res.status(500).json(err);                        
                } else {
                    res.status(200).json('succeed in udpate user:' + userId + ' config');                    
                }            
            });
        }
    });      
});

/**
 * ユーザの設定情報を更新する
 * 設定情報のvalueを変更する
 * @param {String} id
 * @param {String} configId 
 * @param {String} value
 */
router.post('/users/:id/configs/:configId/value', function (req, res, next) {

    console.log(req.body);
    var userId = req.params.id;
    var configId = req.params.configId;
    var config = req.body;

    User.findOne({id: userId}, function(err, user){
        if (err) {
            res.status(500);
        } else {
            for (var i = 0; i < user.configs.length; i++) {
                if (user.configs[i]._id == configId) {
                    user.configs[i].value = config.value;
                }                
            }
            user.save(function (err) {
                if (err) {
                    res.status(500).json(err);                        
                } else {
                    res.status(200).json('succeed in udpate user:' + userId + ' config');                    
                }            
            });
        }
    });      
});  


/**
 * ユーザの設定情報を削除する
 * @param {String} id
 * @param {String} configId 
 */
router.delete('/users/:id/configs/:configId', function (req, res, next) {

    var userId = req.params.id;
    var configId = req.params.configId;
    
    User.findOne({id: userId}, function(err, user) {
        if (err) {
            res.status(500).json(err);                       
        } else {
            for (var i = 0, l = user.configs.length; i < l; i++) {
                if (user.configs[i]._id == configId) {
                    user.configs[i].remove();
                }
            }
            user.save(function (err) {
                if (err) {
                    res.status(500).json(err);                        
                } else {
                    res.status(200).json('succeed in delete user config:' + userId);                                
                }            
            });            
        }
    });    
});

/**
 * ユーザの設定情報を更新する
 * 設定情報のtagを削除する
 * @param {String} id
 * @param {String} configId 
 * @param {String} tagName
 */
router.delete('/users/:id/configs/:configId/tags/:tagName', function (req, res, next) {

    var userId = req.params.id;
    var configId = req.params.configId;
    var tagName = req.params.tagName;

    User.findOne({id: userId}, function(err, user) {
        if (err || user == null) {
            res.status(500).json(err);                       
        } else {
            for (var i = 0; i < user.configs.length; i++) {
                if (user.configs[i]._id == configId) {
                    // 配列から特定要素を削除
                    user.configs[i].tags = user.configs[i].tags.filter(function(v, i) {
                        return (v !== tagName);
                    });                    
                }
            }
            user.save(function (err) {
                if (err) {
                    res.status(500).json(err);                        
                } else {
                    res.status(200).json('succeed in delete user config:' + userId);                                
                }            
            });
        }
    });
});


function fetchUserPromise(query, filter) {
    return new Promise(function (resolve, reject) {
        User.findOne(query, filter, function(err, user) {
            if (err){
                reject(new Error(err));
            } else {
                resolve(user);
            }
        });
    });
}

function fetchUserListPromise(query, filter) {
    return new Promise(function (resolve, reject) {
        User.find(query, filter, function(err, users) {
            if (err){
                reject(new Error(err));
            } else {
                resolve(users);
            }
        });
    });
}

function fetchUserRandomPromise(query, filter) {
    return new Promise(function (resolve, reject) {
        User.findOneRandom(query, filter, function(err, user) {
            if (err){
                reject(new Error(err));
            } else {
                resolve(user);
            }
        });
    });    
}

function createUserPromise(userData) {
    return new Promise(function (resolve, reject) {
        User.create(userData, function(err) {
            if (err) {
                reject(new Error(err));
            } else {
                resolve();
            }
        });
    });
}

function updateUserPromise(userId, userData) {
    return new Promise(function (resolve, reject) {
        User.update({id: userId}, userData, function(err){
            if (err) {
                reject(new Error(err));
            } else {
                resolve();
            }            
        });
    });
}

function deleteUserPromise(userId) {
    return new Promise(function (resolve, reject) {
        User.remove({id: userId}, function(err){
            if (err) {
                reject(new Error(err));
            } else {
                resolve();
            }            
        });
    });
}



/**
 * UserManagerを購読しているAPIを取得する
 */
function fetchSubscriber() {
    return new Promise(function (resolve, reject) {
        
    });
}

function publishPromise(url) {
    return new Promise(function (resolve, reject) {
       request.get(url, function(err, response, body) {
           if (!err && response.statusCode == 200) {
               resolve();
           } else {
               reject(new Error(err));
           }
       });
    });
}


// Forbidden
router.get('*', function(req, res){
	res.status(403).send('Forbidden');
});



module.exports = router;
