var config = {
    serverPort: '9527',    
    db_server:(process.env.MONGO || 'mongo'),    
    db:(process.env.DB ||'mtmhome'),
    mongoHost: '127.0.0.1', 
    mongoPort: '27017', 
    mongoUser: 'dadaozei', 
    mongoPass: 'dadaozei-dev', 
    mongoDb: 'dadaozei',
    applet: {
        AppID:'wxc3fdbae2b2a89a7b',
        AppSecret:'fe64d754c2e4956249d770a6b3c9f235'
    },
    weixin: {
        token:'mtmweixin',
		appid:"wxe29ba3019a16614a",
        secret:"adfd9078b68f5e15ed6d6d7815c2042d",
    }
}    

module.exports = config;
