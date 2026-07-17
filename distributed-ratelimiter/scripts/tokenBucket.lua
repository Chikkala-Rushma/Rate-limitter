local key = KEYS[1]

local capacity = tonumber(ARGV[1])
local refillRate = tonumber(ARGV[2])

-- Current Redis time (milliseconds)
local time = redis.call("TIME")
local currentTime =
    tonumber(time[1]) * 1000 +
    math.floor(tonumber(time[2]) / 1000)

local bucket = redis.call(
    "HMGET",
    key,
    "tokens",
    "last_refill"
)

-- New bucket
if not bucket[1] then

    local remainingTokens = capacity - 1

    redis.call(
        "HSET",
        key,
        "tokens",
        remainingTokens,
        "last_refill",
        currentTime
    )

    local ttl =
        math.ceil(((capacity - remainingTokens) / refillRate) * 1000)

    redis.call("PEXPIRE", key, ttl)

    return {
        1,
        remainingTokens,
        0
    }
end

local storedTokens = tonumber(bucket[1])
local lastRefill = tonumber(bucket[2])

local elapsed =
    math.max(0, currentTime - lastRefill)

local generatedTokens =
    (elapsed / 1000) * refillRate

local availableTokens =
    math.min(
        capacity,
        storedTokens + generatedTokens
    )

-- Rejected
if availableTokens < 1 then

    local retryAfter =
        math.ceil(((1 - availableTokens) / refillRate) * 1000)

    local ttl =
        math.ceil(((capacity - availableTokens) / refillRate) * 1000)

    redis.call(
        "HSET",
        key,
        "tokens",
        availableTokens,
        "last_refill",
        currentTime
    )

    redis.call("PEXPIRE", key, ttl)

    return {
        0,
        availableTokens,
        retryAfter
    }
end

-- Allowed
local remainingTokens =
    availableTokens - 1

local ttl =
    math.ceil(((capacity - remainingTokens) / refillRate) * 1000)

redis.call(
    "HSET",
    key,
    "tokens",
    remainingTokens,
    "last_refill",
    currentTime
)

redis.call("PEXPIRE", key, ttl)

return {
    1,
    remainingTokens,
    0
}