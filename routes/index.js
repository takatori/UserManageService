var express = require('express');
var router = express.Router();

var User = require('../models/user').User;


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'topページ',
        errors: {}
    });
});


/* 一覧取得 */
/* GET user list page */
router.get('/users', function(req, res, next) {
    // 全ユーザ取得
    User.find({}, function(err, data) {
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

// 個人取得
router.get('/users/:id', function(req, res) {
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



/* 追加  */
/* GET register page. */
router.get('/register', function(req, res, next) {
    res.render('register/index', {
        title: 'ユーザ登録',
        errors: {}
    });
});

/* POST user */
// POSTでフォームから飛んできたデータをモデルに保存、失敗したらフォームに戻す
router.post('/register/confirm', function(req, res, next) {
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

router.get('/register/complete', function(req, res, next) {
    res.render('register/complete', {
        title: 'ユーザ登録完了'
    });
});


/* 削除 */
router.delete('/users/:id', function(req, res, next) {
   User.remove({id: req.params.id}, function(err) {
       if (err) {
           console.log(err);
       } else {
           res.redirect('/users');
       }
   });
});




/*****************  API *****************************/


router.delete('/api/users/:id', function(req, res, next) {
   User.remove({id: req.params.id}, function(err) {
       if (err) {
           res.send(err);
       } else {
           res.send("200");
       }
   });
});

module.exports = router;
