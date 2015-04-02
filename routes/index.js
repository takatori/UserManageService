/*
 * Application
 * viewを提供する
 * レスポンスはテンプレートをレンダリングして返す
 */

var express = require('express');
var router = express.Router();
var User = require('../models/user').User;
var config = require('../config');

var loginCheck = function(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};



router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'UserManageService',
        errors: {}
    });
});


router.get('/login', function(req, res){

    var id       = req.query.id;
    var password = req.query.password;

    var query    = {id: id, password: password};
    User.findOne(query, function (err, data) {
        if (err) {
            res.render('login', { errors: "エラーが発生しました。管理者に問い合わせてください。" });            
        } else if (!data) {
            res.render('login', { errors: "パスワードが間違っているかアカウントが存在しません" });            
        } else {
            req.session.user = id;
            res.redirect('/');
        }
    });
});

// GET
/* List */
router.get('/users', loginCheck, function(req, res, next) {
    
    // 現在のユーザ取得
    var query = { group: { $in : config.current }};
    
    User.find(query, {}, {sort:{group: -1}}, function(err, data) {
        if (err) {
            res.render('users', {
                title: 'ユーザ一覧取得エラー',
                errors: err.erros
            });
        } else {
           res.render('users', {
               users: data
           });
        }
    });
});


/* Unit */
router.get('/users/:id', loginCheck, function(req, res) {
    User.findOne({id: req.params.id}, function(err, data) {
        if (err) {
            // TODO
        } else {
            res.render('user', {
                user: data
            });
        }
    });
});



// CREATE
/* */
router.get('/register', function(req, res, next) {
    res.render('register/index', {
        title: 'ユーザ登録',
        errors: {}
    });
});

/* POST user */
// POSTでフォームから飛んできたデータをモデルに保存、失敗したらフォームに戻す
router.post('/register/confirm', function(req, res, next) {
 
    console.log(req.body);

    User.create(req.body, function(err){
        if (err) {
            res.render('register/index', {
                title: 'ユーザ登録エラー',
                errors: err.errors
            });
        } else {
            //req.session.name = req.body.name;
            //req.session.email = req.body.email;
            res.redirect('/register/complete');
        }
    });
});

router.get('/register/complete', function(req, res, next) {
    res.render('register/complete', {
        title: 'ユーザ登録完了'
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
            res.redirect('/users/' + userId);
        }
    });
});


// DELETE
router.get('/users/delete/:id', loginCheck, function(req, res, next) {
   User.remove({id: req.params.id}, function(err) {
       if (err) {
           console.log(err);
       } else {
           res.redirect('/users');
       }
   });
});


module.exports = router;
