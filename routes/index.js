var express = require('express');
var router = express.Router();

var User = require('../models/user').User;


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index.ect', {
        title: 'topページ',
        errors: {}
    });
});


/* GET register page. */
router.get('/register', function(req, res, next) {
    res.render('register/index', {
        title: 'ユーザ登録',
        errors: {}
    });
});


// POSTでフォームから飛んできたデータをモデルに保存、失敗したらフォームに戻す
router.post('/register/confirm', function(req, res) {
    //var newUser = new User(req.body);
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

router.get('/register/complete', function(req, res) {
    res.render('register/complete', {
        title: 'ユーザ登録完了'
    });
});

module.exports = router;
