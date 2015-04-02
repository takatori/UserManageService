/*
 * APIs 
 * apiを提供する
 * レスポンスはJSONで返す
 */

var express = require('express');
var router = express.Router();
var User = require('../models/user').User;
var config = require('../config');

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

// Forbidden
router.get('*', function(req, res){
	res.status(403).send('Forbidden');
});



module.exports = router;
