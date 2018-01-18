var mongoose = require('mongoose');

var UserSchema  = new mongoose.Schema({
    openid: {type:String},
    session_key: {type:String},
    expires_in: {type:Number},
    nickname: {type:String}
});

module.exports = mongoose.model('User', UserSchema)
