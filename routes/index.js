// メモ
// prototypeは親オブジェクト（クラスメソッド）のようなもの
// 参考:http://qiita.com/Haru39/items/809114f943208aaf55b3
// _（アンダースコア）はprivateを意味する.javascriptにはないのでオレオレルール

var mongoose = require('mongoose');
var User = mongoose.model('users');
var config = require('../config');


/**
 *  インデックスページの表示
 */
exports.index = function (req, res) {
    var options = {};
    options.criteria = { group : { $in : config.current.type}};
    options.field = {'_id': 1, 'last_name':1};

    User.list(options, function(err, users) {
      if (err) new Error('load current user error');
      res.render('index', {
          title: "UserManageService",
          user_list: users
      });
    });
};


/**
 * Find user by id
 */
exports.single = function (req, res, next) {
    var options = {};
    options.criteria = { group : { $in : config.current.type}};
    options.field = {'_id': 1, 'last_name':1};
      
      User.list(options, function(err, users) {
      if (err) new Error('load current user error');
      User.load(req.params.id, function(err, user_data) {
        if (err) new Error('user load error');
        res.render('user.ejs', {
          title: user_data._id,
          user_data: user_data,
          user_list: users
        });
      });
    });
};


/**
 *
 */
exports.list = function(req, res, next)  {
    User.list({},function(err, users) {
      if (err) return next(err);
      if (!users) return next(new Error('not found'));
      res.render('user_list.ejs', {
        title:"user_list",
        user_list: users
      });
    });
};



/**
 * ユーザ作成フォーム表示
 */
exports.create = function (req, res) {
    res.render('create-user', {
        title: 'Create New User'
    });
};

/**
 * 新規ユーザ登録
 */
exports.create.post = function(req, res) {
    var user = new User(req.body);

    user.create(function (err) {
      console.log(err);
      if (!err) {
        return res.redirect('/users');
      }

      res.render('user/create', {
        title: 'New User',
        user: user,
        error: utils.errors(err.errors || err)
      });
    });
};


exports.destroy = function(req, res) {
  console.log(req.params.id);
      User.destroy(req.params.id, function(err) {
          if (err) return next(err);
          res.redirect("/users");
      });
};






