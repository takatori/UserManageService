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

### [GET] /apis/users



### apiary.io
* [apiary.io](http://docs.usermanageservice.apiary.io)


