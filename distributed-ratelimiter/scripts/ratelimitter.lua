-- Atomic sliding-window-log rate limiter.
-- KEYS[1] = rate limit key (e.g. "rate_limit:<ip>")
-- ARGV[1] = current timestamp in ms
-- ARGV[2] = window size in ms
-- ARGV[3] = max requests allowed per window
-- ARGV[4] = unique member id for this request

local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])
local member = ARGV[4]

local minScore = now - window

redis.call("ZREMRANGEBYSCORE", key, "-inf", minScore)

local count = redis.call("ZCARD", key)

if count >= limit then
    local oldest = redis.call("ZRANGE", key, 0, 0, "WITHSCORES")
    local oldTimeStamp = tonumber(oldest[2])
    local retryAfter = math.ceil((oldTimeStamp + window - now)/1000)    
    return {0,retryAfter,limit,0}
end

redis.call("ZADD", key, now, member)
redis.call("PEXPIRE", key, window)

return {1,0,limit,limit - count - 1}
