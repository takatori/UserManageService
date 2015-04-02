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
    
    User.findOne({id: userId}, function(err, user){
        if (err) {
            res.status(500).json(err);            
        } else {
            for (var key in userData) {
                user[key] = userData[key];
            }
            user.save();
            res.status(200).json('succeed in create user:' + userData);            
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
router.get('*', function(req, res){
	res.status(403).send('Forbidden');
});



module.exports = router;
