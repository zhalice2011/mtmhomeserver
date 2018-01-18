var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});

// 实现文件下载。
router.get('/file/:fileName', function (req, res, next) {
    // 实现文件下载 
    var fileName = req.params.fileName;
    var filePath = path.join(__dirname, "../public", fileName);
    var stats = fs.statSync(filePath);
    if (stats.isFile()) {
        res.set({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': 'attachment; filename=' + fileName,
            'Content-Length': stats.size
        });
        fs.createReadStream(filePath).pipe(res);
    } else {
        res.end(404);
    }
});


// 实现小程序的https请求
router.get('/wechat', function (req, res, next) {
    console.log("这是微信小程序发过来的请求哦")
})


// 当用户一进去小程序就会请求的接口  微信登录
router.post('/user/login', function (req, res) {
    // 取到传入的code参数
    var code = req.body.code;
    console.log("微信登录,code=", code)

    //code: 081nSMli15zTzz0TT6mi1rPAli1nSMlY
    // 设定小程序appid appsecret
    var APPID = 'wxc3fdbae2b2a89a7b';
    var SECRET = 'fe64d754c2e4956249d770a6b3c9f235';
    // 拼接请求地址
    var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + APPID + '&secret=' + SECRET + '&js_code=' + code + '&grant_type=authorization_code';
    // 向微信请求openid等信息
    var request = require('request');
    request(url, function (error, response, body) {
        // {"session_key":"ZPp6HkQCI6ZCfkTIyseIPQ==","expires_in":7200,"openid":"ox-0I0VkzCYSFllCNgVWQ4PffMM0"}
        console.log(body); //{"session_key":"Y8zDAEEEgm1tVuMQOFmhdw==","openid":"oKrD30CrJ0SvK0ydry1K-c-RFy8U"}
        var info = JSON.parse(body);
        // 获取openid之后查询数据库
        // 查询用户是否已经存在
        require('../models/User');
        var User = mongoose.model('User');
        User.find({
            openid: info.openid
        }, function (err, users) {
            if (users.length == 0) {
                console.log("用户不存在将openid存入数据库")
                // 将openid存入数据库
                var user = new User({
                    openid: info.openid
                });
                user.save();
            }
            console.log("服务器返回给前端的数据",info.openid)
            res.send({
                code: 1,
                data: {
                    openid: info.openid
                },
                msg: '登录成功'
            });
        }); 

        // //保存数据
        // var info = JSON.parse(body);
        // //构造数据
        // var user = new User({
        //     openid: info.openid
        // });
        // //保存数据
        // user.save();
    })
});


module.exports = router;
