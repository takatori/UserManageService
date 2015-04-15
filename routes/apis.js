/*
 * APIs 
 * apiを提供する
 * レスポンスはJSONで返す
 */

var express = require('express');
var router = express.Router();
var User = require('../models/user').User;
var config = require('../config');
var fs = require('fs');


//===================== USER ==========================
// GET
/* List */
/** ALL **/
router.get('/users', function(req, res, next) {
    User.find({}, function(err, data) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).json(data);
        }
    });
});
/** Current **/
router.get('/users/current', function(req, res, next) {
    var query = { group: { $in : config.current }};
    User.find(query, function(err, data) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).json(data);
        }
    });
});


/* Unit */
router.get('/users/:id', function(req, res) {
    User.findOne({id: req.params.id}, function(err, data) {
        if (err) {
            res.status(500).json(err);            
        } else {
            res.status(200).json(data);            
        }
    });
});

// // 画像だけ取り出す
// router.get('/users/:id/img', function(req, res) {
//     User.findOne({id: req.params.id}, {icon_img: true}, function(err, data) {
//         if (err) {
//             res.status(500).json(err);            
//         } else {
//             // res.status(200).json(data.icon_img);
//             // convert base64 string back to image 
//             base64_decode(data.icon_img.split(',')[1], 'copy.jpg');
//             //var buf = new Buffer(data.icon_img, 'base64');
//             var buf = fs.readFileSync('copy.jpg');            
//             res.sendfile(buf, { 'Content-Type': 'image/jpeg' }, 200);            
//         }
//     });
// });

// // function to create file from base64 encoded string
// function base64_decode(base64str, file) {
//     // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
//     var bitmap = new Buffer(base64str, 'base64');
//     // write buffer to file
//     fs.writeFileSync(file, bitmap);
//     console.log('******** File created from base64 encoded string ********');
// }


// CREATE
router.post('/users', function(req, res, next) {
    console.log(req.body);
    var userData = req.body;
    User.create(userData, function(err){
        if (err) {
            res.status(500).json(err);            
        } else {
            res.status(200).json('succeed in create user:' + userData);            
        }
    });
});


// UPDATE
router.post('/users/:id', function(req, res, next) {
    console.log(req.body);
    var userId = req.params.id;    
    var userData = req.body;
    
    User.update({id: userId}, userData, function(err){
        if (err) {
            res.status(500);
        } else {
            res.status(200).json('succeed in udpate user:' + userData);
        }
    });    
});



// DELETE
router.delete('/users/:id', function(req, res, next) {
    var userId = req.params.id;
    User.remove({id: userId}, function(err) {
        if (err) {
            res.status(500).json(err);                       
        } else {
            res.status(200).json('succeed in delete user:' + userId);
        }
    });
});



// Others
/* 学生からランダムに一人取り出す */
router.get('/users/students/random', function (req, res, next) {

    var filter = { group: { $in : config.student }};
    var fields = { last_name:1, first_name:1, nick_name:1 };
    User.findOneRandom(filter, fields, function(err, user) {
        if (err) {
            res.status(500);
        } else {
            res.status(200).json(user);
        }        
    });
});

/* 卒業 */
router.get('/graduate/:id', function (req, res, next) {
    var userId = req.params.id;

    var graduationYear = (new Date).getFullYear() + 'Graduates';
    var userData = { group: graduationYear };
    
    User.update({id: userId}, userData, function(err){
        if (err) {
            res.status(500);
        } else {
            res.status(200).json('succeed in udpate user:' + userData);
        }
    });        
});

/* 進級 */
router.get('/promotion/:id', function (req, res, next) {
    var userId = req.params.id;
    User.findOne({id: userId}, function(err, user){
        if (err) {
            res.status(500);
        } else {
            if (!user) res.status(500).send('Cannot find User:' + userId);

            var grade = { group: promotion(user.group)};
            User.update({id: userId}, grade, function (err){
                if (err) {
                    res.status(500);
                } else {
                    res.status(200).json('succeed in udpate user:' + userId);                    
                }
            });

        }
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

//===================== CONFIG ==========================

// GET
/* ALL */
router.get('/users/:userId/configs', function (req, res, next) {
    User.findOne({id: req.params.userId}, {configs: true}, function(err, data) {
        if (err) {
            res.status(500).json(err);            
        } else {
            res.status(200).json(data);            
        }
    });
    
});

/* タグ検索 */
router.post('/users/:userId/configs/search', function (req, res, next) {

    var userId  = req.params.userId;
    var queries = req.body.tags;    
    var value   = [];
    
    User.findOne({id: req.params.userId}, {configs: true}, function(err, user) {
        if (err) {
            res.status(500).json(err);            
        } else {
            for (var i = 0; i < user.configs.length; i++) {
                if (isContainAllQueries(user.configs[i].tags, queries)) {
                    value.push(user.configs[i].value);                    
                }
            }
            res.status(200).json(value);            
        }
    });
});

// tagの中にqueriesの要素がすべてあればtrue,なければfalseを返す
function isContainAllQueries (tags, queries) {
    for (i = 0; i < queries.length; i++) {
        if (tags.indexOf(queries[i].toString()) < 0) return false;
    }
    return true;
}

// CREATE
router.post('/users/:userId/configs', function (req, res, next) {
    console.log(req.body);
    var userId = req.params.userId;
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


// UPDATE
/* add tag */
router.post('/users/:userId/configs/:configId/tags', function (req, res, next) {

    console.log(req.body);
    var userId = req.params.userId;
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

/* change value */
router.post('/users/:userId/configs/:configId/value', function (req, res, next) {

    console.log(req.body);
    var userId = req.params.userId;
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


// DELETE
/* config delete */
router.delete('/users/:userId/configs/:configId', function (req, res, next) {

    var userId = req.params.userId;
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

/* tag delete */
router.delete('/users/:userId/configs/:configId/tags/:tagName', function (req, res, next) {

    var userId = req.params.userId;
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



// Forbidden
router.get('*', function(req, res){
	res.status(403).send('Forbidden');
});



module.exports = router;
