
var express = require('express');
var router = express.Router();

var User = require('../models/user').User;

var loginCheck = function(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'UserManageService',
        errors: {}
    });
});

/* GET Login page. */
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

/* 一覧取得 */
/* GET user list page */
router.get('/users', loginCheck, function(req, res, next) {
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


/* 削除 */
router.delete('/users/:id', loginCheck, function(req, res, next) {
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
