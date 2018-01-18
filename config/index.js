var config = {
    db_server:(process.env.MONGO || 'mongo'),    
    db:(process.env.DB ||'mtmhome')
}    

module.exports = config;
