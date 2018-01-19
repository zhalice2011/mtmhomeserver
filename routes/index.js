const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const config = require('../config/index');
const uuid = require('node-uuid');  

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});


// 当用户一进去小程序就会请求的接口  微信登录
router.post('/user/login', function (req, res) {
    // 取到传入的code参数
    const code = req.body.code;
    const APPID = config.applet.AppID
    const SECRET = config.applet.AppSecret
    console.log("微信登录,code=", code)
    // 拼接请求地址
    const url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + APPID + '&secret=' + SECRET + '&js_code=' + code + '&grant_type=authorization_code';
    // 向微信请求session_key等信息
    const request = require('request');
    request(url, function (error, response, body) {
        console.log("请求session_key",body); //{"session_key":"Y8zDAEEEgm1tVuMQOFmhdw==","openid":"oKrD30CrJ0SvK0ydry1K-c-RFy8U"}
        const info = JSON.parse(body);
        // 获取openid之后查询数据库
        // 查询用户是否已经存在
        require('../models/User');
        const User = mongoose.model('User');
        User.find({
            openid: info.openid
        }, function (err, users) {
            if (users.length == 0) {
                console.log("用户不存在将openid存入数据库")
                // 将openid存入数据库
                const user = new User({
                    openid: info.openid,
                    session_key: info.session_key,
                    mid:uuid.v1()  // 生成唯一id
                });
                user.save();
            }
            console.log("服务器返回给前端的数据",info.openid)
            res.send({
                code: 1,
                data: {
                    openid: info.openid,
                    //session_key: info.session_key,
                },
                msg: '登录成功'
            });
        }); 
    })
});

// 当用户进入我的页面  然后点击完善资料的时候
// 更新用户信息
router.post('/user/update', function (req, res, next) {
    // 接收传参，包括openid,nickname,avatar
    const info = req.body;
    console.log("用户完善信息", info)
    require('../models/User');
    const User = mongoose.model('User');
    // 以openid为条件查询找到对应用户
    const data = {
        avatarUrl:info.avatarUrl,
        nickname:info.nickname,
        gender:info.gender,
        avatarUrl:info.avatarUrl,
        address:{
            country:info.country,
            province:info.province,
            city:info.city,
        }
    }
    User.update({openid:info.openid},data,{upsert:false},function(err,user){
        if (err) next(err);
        if (user){
            console.log("更新后的data",user)
            // 返回用户信息给前端
            res.send({
                code: 1,
                data: user,
                msg: '更新成功'
            });
        }
    })
});

module.exports = router;
