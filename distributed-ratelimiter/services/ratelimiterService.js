import { readFileSync } from "fs";
import path from "path";
import redisService from "../redis/redisService.js";
import { randomUUID } from "crypto";
import { registerScript, getScriptSha, getScript } from "../redis/scriptRegistry.js";

const rateLimitScript = readFileSync(
    path.join(import.meta.dirname, "../scripts/ratelimitter.lua"),
    "utf8"
);

const windowSizeInMs = 60 * 1000; // 1 minute
const maxRequests = 5; // Maximum requests allowed in the window

export async function checkRateLimit(ip) {
    try {
        let key = `rate_limit:${ip}`;
        let now = Date.now();
        let member = randomUUID(); // Unique identifier for the request
        const result = await redisService.executeScript(
            'ratelimitter',
            [key],
            [now.toString(), windowSizeInMs.toString(), maxRequests.toString(), member]
        );
        return result;
        
    } catch (err) {
        console.error("Error checking rate limit:", err);
        throw err;
    }
}
