const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || '');

    return this;
}

mongoose.Query.prototype.exec = async function () {

    //if cache no needed
    if(!this.useCache){
        return exec.apply(this, arguments);
    }

    console.log("ABOUT TO RUN A QUERY");

    const key = JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    }));

    console.log(`key ===>> ${key}`);

    const cacheValue = await client.hget(this.hashKey, key);

    if(cacheValue){
        console.log("from cache");
        const doc = JSON.parse(cacheValue);

        //handle if array or single model
        return Array.isArray(doc)
            ?   doc.map( d => new this.model(d))
            :   new this.model(doc);
    }
    console.log("From DB");
    
    const result = await exec.apply(this, arguments);
    
    client.hmset(this.hashKey, key, JSON.stringify(result), 'EX', 10);
    
    return result;
}

module.exports = {
    clearHash(hashKey){
        client.del(JSON.stringify(hashKey));
    }
}