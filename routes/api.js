var mongoose = require('mongoose');
var User = mongoose.model('users');
var config = require('../config');


exports.single = function(req, res) {
    User.load(req.params.id, function(err, user) {
      if (err) new Error('load user error');
      res.json(200, user);
    });
};

exports.allUsers = function(req, res) {
    var options = {};
    options.field = {'_id': 1, 'last_name':1};

    User.list(options, function(err, users) {
      if (err) new Error('load usre list error');
      res.json(200, users);
    });
};

exports.currentUsers = function(req, res) {
    var options = {};
    options.criteria = { group : { $in : config.current.type}};
    options.field = {'_id': 1, 'last_name':1};

    User.list(options, function(err, users) {
      if (err) new Error('load current user error');
      res.json(200, users);
    });

};
