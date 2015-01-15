// 参考: https://github.com/madhums/node-express-mongoose-demo/blob/master/app/models/user.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

/**
 * User Schema
*/
var UserSchema = new Schema({
    _id :        { type: String, default: '', required: true},    // id 登録ID
    stu_id :    { type: String, default: ''},                   // stu_id 学籍番号
    first_name: { type: String, default: '', equired: true },   // 名
    last_name:  { type: String, default: '', required: true },   // 姓
    screen_name:{ type: String, default: '', required: true},    // 愛称・ニックネーム
    sex:        { type: String}, // 性別 [male, female]
    birthday:   { type: Date, }, // 生年月日
    group:      { type: String}, // 学年 [B3, B4, M1, M2, Stuff, 20xxGraduates, ...]
    tel:        { type: String}, // 電話番号
    home_tel:   { type: String}, // 実家電話番号
    mail:       { type: String}, // メールアドレス
    mob_mail:   { type: String}, // 携帯メールアドレス
    addr:       { type: String}, // 現住所
    home_addr:  { type: String}, // 実家住所
    img_url:    { type: String}  // アイコンのアドレス
});


/**
 * Virtuals
 * 属性としては取得もセットもしたいけれど、 mongodb に永続化したくない場合、 virtual 属性を使う。
 * 参考: http://muddy-dixon.appspot.com/ja/mongoosejs/virtuals.html
 */
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function() { return this._password;});

UserSchema
  .virtual('full_name')
  .get( function() {
    return this.last_name + this.first_name;
});

/**
 * Validations
 * 参考:http://muddy-dixon.appspot.com/ja/mongoosejs/validation.html
 */
UserSchema.path('first_name').required(true, 'first_name cannot be blank');


/**
 * Pre-remove hook
 */
UserSchema.pre('remove', {});


/**
 * Method
 */
UserSchema.methods = {

};


/**
 * Statics
 */
UserSchema.statics = {

     load: function(id, callback) {
        this.findOne({_id: id})
          .exec(callback);
     },

     list: function(options, callback) {
        var criteria = options.criteria || {};
        var field = options.field || {};

        this.find(criteria, field)
            .sort({_id:1})
            .exec(callback);
     }
};



mongoose.model('users', UserSchema);