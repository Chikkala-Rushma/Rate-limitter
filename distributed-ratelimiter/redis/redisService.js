import {redisClient as client } from "../config/redisClient.js";

class RedisService {

    async zAdd(key, score, member) {
        return client.zAdd(key, {
            score,
            value: member,
        });
    }

    async zCard(key) {
        return client.zCard(key);
    }

    async zRemRangeByScore(key, min, max) {
        return client.zRemRangeByScore(key, min, max);
    }

    async expire(key, seconds) {
        return client.expire(key, seconds);
    }

    async eval(script, keys, args) {
        return client.eval(script, {
            keys,
            arguments: args,
        });
    }

}
export default new RedisService();