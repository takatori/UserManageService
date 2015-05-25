var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var random = require('mongoose-simple-random');

var ConfigSchema = new mongoose.Schema({
    tags   : [String],
    value  : { type: String }
});

var UserSchema = new mongoose.Schema({
    id :        { type: String, default: '', required: true, unique: true},    // id 登録ID
    password:   { type: String, required: true}, // パスワード
    stu_id :    { type: String},                   // stu_id 学籍番号
    first_name: { type: String, required: true},   // 名
    last_name:  { type: String, required: true},   // 姓
    nick_name:  { type: String, required: true},    // 愛称・ニックネーム
    sex:        { type: String, enum:['male', 'female']}, // 性別 [male, female]
    birthday:   { type: String}, // 生年月日
    group:      { type: String}, // 学年 [B3, B4, M1, M2, Stuff, 20xxGraduates, ...]
    tel:        { type: String}, // 電話番号
    mobile_tel: { type: String}, // 携帯電話番号
    email:      { type: String}, // メールアドレス
    addr:       { type: String}, // 現住所
    home_addr:  { type: String}, // 実家住所
    icon_img:   { type: String}, // アイコン画像データ
    configs:    [ConfigSchema]
});
UserSchema.plugin(uniqueValidator, {message: '既に登録されているユーザです'});
UserSchema.plugin(random);

/**
 * ユーザIDのバリデーション
 * idは3文字以上15文字以下の半角英数のみ許可する
 */
UserSchema.path('id').validate(function(value){
    return /^[a-zA-Z0-9]{3, 15}$/.test(value);
}, 'Invalid id');

/**
 * パスワードのバリデーション
 * passwordは8文字以上15文字のみ許可する
 */
UserSchema.path('password').validate(function(value){
    return /^[a-zA-Z0-9!@#$%_¥+]{3, 15}$/.test(value);
}, 'Invalid password');




module.exports.User = mongoose.model('User', UserSchema);










