// var fs = require('fs');
// var httpServ = require('https');
// var WebSocketServer = require('ws').Server;

// var app = httpServ.createServer({
//     key: fs.readFileSync('2_mtmhome.lovezhishu.cn.key'),
//     cert: fs.readFileSync('1_mtmhome.lovezhishu.cn_bundle.crt')
// })
// app.listen(8000,function() {
//     console.log('server started.')
// });

// var wss = new WebSocketServer({
//     server: app
// });

// wss.on('connection', function(wsConnect) {
//     wsConnect.on('message', function(message) {
//         console.log("接受消息 ",message);
//         wsConnect.send('reply');
//     });
// });


var https = require('https')
,fs = require("fs");
var express = require('express');
var app = express();
var options = {
key: fs.readFileSync('2_mtmhome.lovezhishu.cn.key'),
cert: fs.readFileSync('1_mtmhome.lovezhishu.cn_bundle.crt')
};
https.createServer(options, app).listen(8081, function () {
console.log('Https server listening on port ' + 8081);
});