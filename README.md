UserManageService
=================
[![Build Status](https://travis-ci.org/takatori/UserManageService.svg?branch=master)](http://travis-ci.org/takatori/UserManageService)
研究室メンバー情報管理用サービス
![top](https://github.com/takatori/UserManageService/blob/master/images/top.png)

## Description
シンプルなメンバー情報管理システムです。
研究室メンバーの氏名や生年月日、連絡先を管理します。

## Demo
* heroku
  * https://user-manage-service.herokuapp.com/
  * id: takatori, pass: takatoriでログインできます

## Dependencies
* Node.js >= 1.3
* express >= 2.0
* mongodb 

## Usage
### 起動
* 本番環境　
```
run.sh -m prod
```
* 開発環境
```
run.sh
```
* テスト
```
run.sh -m test
```
### プロセス確認
* 本番環境
```
npm run forever-list
```
### 終了
* 本番環境
```
npm run foreve-stop $pid
```

## APIs
### [GET] /apis/users
* 全ユーザの情報を返す
* @return{[User]}

### [GET] /apis/users/current
* 現役のユーザーの情報で指定した属性のみを返す
* @param {String} filter 属性情報 ex: filter=first_name,last_name
* @return {[User]}

### [GET] /apis/users/:id
* 指定されたidのユーザ情報を返す
* @param {String} id
* @return {Object} user ユーザ情報

### [POST] /apis/users
* 新規ユーザを登録する
* @param {Object}  ユーザ情報

### [POST] /apis/users/:id
* ユーザ情報を更新する
* @param {String} id
* @param {Object} ユーザ情報

### [DELETE] /apis/users/:id
* ユーザを削除する
* @param {String} id

### [GET] /apis/users/students/random
* 学生からランダムに一人取り出す
* @return {Object} user ユーザ情報 ex: {last_name:Takatori, first_name:Satoshi, nick_name: tori}

### [GET] /apis/users/:id/graduate
* ユーザの所属グループを卒業生に変更する
* @param {String} id


### [GET] /apis/users/:id/promotion
* ユーザの所属グループを現在の学年から一つ上げる
* @param {String} id

### [GET] /apis/users/:id/configs
* ユーザの設定情報一覧を取得する
* @param {String} id
* @return {Object} configs

### [GET] /apis/users/:id/configs/search
* ユーザの設定情報をタグで検索する
* @param {String} id 
* @param {[String]} tags ex:['test', 'test2']
* @return {Object} configs

### [POST] /apis/users/:id/configs
* ユーザの設定情報を新規登録する 
* @param {String} id
* @param {Object} config

### [POST] /apis/users/:id/configs/:configId/tags
* ユーザの設定情報を更新する
* 設定情報のタグを追加する
* @param {String} id
* @param {String} configId 
* @param {String} tag

### [POST] /apis/users/:id/configs/:configId/value
* ユーザの設定情報を更新する
* 設定情報のvalueを変更する
* @param {String} id
* @param {String} configId 
* @param {String} value

### [DELETE] /apis/users/:id/configs/:configId
* ユーザの設定情報を削除する
* @param {String} id
* @param {String} configId

### [DELETE] /apis/users/:id/configs/:configId/tags/:tagName
* ユーザの設定情報を更新する
* 設定情報のtagを削除する
* @param {String} id
* @param {String} configId 
* @param {String} tagName


### apiary.io
* [apiary.io](http://docs.usermanageservice.apiary.io)


