import {redisClient as client } from "../config/redisClient.js";
import { getScript, getScriptInfo } from "./scriptRegistry.js";

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

    async loadScript(script) {
        return client.scriptLoad(script);
    }

    async evalSha(sha, keys, args) {
        return client.evalSha(sha, {
            keys,
            arguments: args,
        });
    }

    async executeScript(scriptName, keys, args) {

    const scriptInfo = getScriptInfo(scriptName);

    if (!scriptInfo) {
        throw new Error(`Lua script '${scriptName}' not found.`);
    }

    try {

        return await this.evalSha(scriptInfo.sha, keys, args);

    } catch (err) {

        if (!err.message.startsWith("NOSCRIPT")) {
            throw err;
        }

        console.log(`Reloading ${scriptName}...`);

        const newSha = await this.loadScript(scriptInfo.script);

        updateSha(scriptName, newSha);

        return await this.evalSha(newSha, keys, args);

    }

}

}
export default new RedisService();