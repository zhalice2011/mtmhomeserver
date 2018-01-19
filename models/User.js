var mongoose = require('mongoose');

var UserSchema  = new mongoose.Schema({
    openid: {type:String},  // 微信用户唯一标识    
    mid: {type:String},     // mtm系统唯一标识
    session_key: {type:String}, // session 会话密钥    
    expires_in: {type:Number}, // 过期时间
    nickname: {type:String}, //微信昵称
    avatar: {type:String},  // 微信头像Url
    gender: {type:Number},  // 性别 0：未知、1：男、2：女
    age: {type: Date},      // 出生日期
    address: { // 地址
        country:String,  // 国家
        province:String, // 省份
        city:String,     // 城市
        district:String, // 区
        other:String,    // 街道信息
    }, 
    register_date: { type: Date, default: Date.now }, // 注册时间
});

module.exports = mongoose.model('User', UserSchema)

