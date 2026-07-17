# Redis Rate Limiting - Interview & Practical Notes

## Redis Command Execution Approaches Comparison

| Feature                    | Normal Commands | Pipeline | MULTI/EXEC                     | WATCH + MULTI        | Lua                  |
|----------------------------|-----------------|----------|--------------------------------|----------------------|----------------------|
| Multiple commands          | ✗               | ✓        | ✓                              | ✓                    | ✓                    |
| Fewer network trips        | ✗               | ✓        | Usually yes (client pipelines) | ✗                    | ✓                    |
| Atomic execution           | ✗               | ✗        | ✓                              | ✓                    | ✓                    |
| Conditional logic          | ✗               | ✗        | ✗                              | ✓ (in application)   | ✓ (inside Redis)     |
| Retry needed               | ✗               | ✗        | ✗                              | ✓                    | ✗                    |
| **Best for rate limiter**  | ✗               | ✗        | ✗                              | Possible             | ⭐ **Best**          |

## Why Lua is Best for Rate Limiting

1. **Single Network Round Trip** - Entire script executes on Redis server
2. **Atomic Execution** - No race conditions, no interleaved commands
3. **Conditional Logic in Redis** - Decision-making happens server-side
4. **No Retry Logic Needed** - Unlike WATCH/MULTI (optimistic locking)
5. **Performance** - Minimal latency, maximum throughput

## Key Interview Points

### Lua Scripts Advantages
- Scripts are atomic - entire script is one operation
- Server-side execution reduces network overhead
- Can use conditional logic (if/else) inside Redis
- Cached on server (EVALSHA for repeated calls)
- No need for optimistic locking retry logic

### WATCH + MULTI Limitations
- Optimistic locking requires retry on conflict
- Network round trips: WATCH → commands → MULTI → EXEC
- High contention = many retries = poor performance
- Good for low-contention scenarios only

### Pipeline Limitations
- NOT atomic - commands can be interleaved
- Only reduces network round trips
- Cannot make decisions based on Redis data
- Unsuitable for race-critical operations like rate limiting

### MULTI/EXEC Limitations
- Atomic but no conditional logic
- All commands must be known upfront
- Cannot change commands based on Redis values
- Still requires application-side logic

## Practical Rate Limiting with Lua

### Common Algorithms
1. **Fixed Window** - Simple counter with TTL
2. **Sliding Window Log** - Stores timestamps in sorted set
3. **Sliding Window Counter** - Weighted count across windows
4. **Token Bucket** - Refill tokens at fixed rate

### Lua Script Pattern
```lua
-- Get current state
local current = redis.call('GET', key)

-- Apply logic
if condition then
  -- Update state
  redis.call('INCR', key)
  return 1  -- allowed
else
  return 0  -- denied
end
```

### Error Handling
- Lua scripts should return meaningful values
- Use return codes: 1 (allowed), 0 (denied)
- Can return arrays: {allowed, remaining, reset_time}

## Common Interview Questions

**Q: Why not use MULTI/EXEC for rate limiting?**
A: Cannot conditionally INCR based on current value within transaction. Need to check count BEFORE incrementing.

**Q: Why not use WATCH + MULTI?**
A: High contention causes frequent retries. In rate limiting, many requests hit same key = poor performance.

**Q: How does Lua script atomicity work?**
A: Redis is single-threaded. Lua script blocks all other commands until complete.

**Q: What if Lua script is slow?**
A: Keep scripts short. Long scripts block Redis. Use SCRIPT KILL if needed (only if no writes occurred).

**Q: How to handle script errors?**
A: Redis returns error to client. No partial execution - atomicity preserved.

## Production Best Practices

1. **Test Lua scripts thoroughly** - No debugger in production
2. **Keep scripts short** - Minimize blocking time
3. **Use EVALSHA** - Cache scripts, send SHA hash not full script
4. **Monitor script execution time** - Use SLOWLOG
5. **Version your scripts** - Different SHA for different logic
6. **Graceful degradation** - Fallback if Redis unavailable
7. **Key naming conventions** - Include prefix, rate limit type, identifier

## Performance Tips

- Prefer simpler algorithms when possible (fixed window vs sliding log)
- Use pipelining for multi-key scenarios (different users)
- Consider sharding for extreme scale (different Redis instances)
- Monitor memory usage for sliding window algorithms
- Set appropriate TTLs to auto-cleanup keys

## Redis Commands Often Used in Rate Limiting

- `INCR` - Increment counter
- `EXPIRE/PEXPIRE` - Set TTL on key
- `ZADD` - Add to sorted set (timestamps)
- `ZREMRANGEBYSCORE` - Remove old entries
- `ZCARD/ZCOUNT` - Count elements
- `GET/SET` - Basic key-value operations
- `TIME` - Get Redis server time (consistency)

## Additional Learning Resources

### Understanding Race Conditions in Rate Limiting
Without atomic operations, this can happen:
1. Request A reads counter: 99
2. Request B reads counter: 99
3. Request A increments to 100
4. Request B increments to 100
Result: Both requests allowed when limit is 100 (should only allow one)

### Why Network Trips Matter
- Each Redis command = network round trip (~1ms in same datacenter)
- 5 commands = 5ms minimum latency
- Lua script with 5 operations = 1ms (single trip)
- At scale: 1000 req/s → 4 seconds saved per second!

### Memory Considerations

**Fixed Window:**
- 1 key per user
- ~100 bytes per key
- 1M users = ~100MB

**Sliding Window Log:**
- 1 sorted set per user
- Each request = 1 entry with timestamp
- 100 req/min limit = 100 entries max
- 1M users = ~10-20GB (depending on retention)

### Distributed Systems Challenges

1. **Clock Skew** - Use Redis TIME command for consistency
2. **Redis Failure** - Have fallback strategy (allow/deny all)
3. **Network Partitions** - Multiple Redis instances need coordination
4. **Key Expiration** - Passive vs active deletion affects memory

### Testing Strategies

```javascript
// Load testing example
async function loadTest() {
  const promises = [];
  for (let i = 0; i < 1000; i++) {
    promises.push(rateLimiter.check('user123'));
  }
  const results = await Promise.all(promises);
  const allowed = results.filter(r => r.allowed).length;
  console.log(`Allowed: ${allowed}/1000`);
}
```

### Debugging Lua Scripts

```bash
# Monitor Redis commands in real-time
redis-cli MONITOR

# Check script cache
redis-cli SCRIPT EXISTS <sha1>

# View slow queries
redis-cli SLOWLOG GET 10

# Test script directly
redis-cli EVAL "return redis.call('GET', KEYS[1])" 1 mykey
```

## Implementation Checklist

- [ ] Choose appropriate algorithm based on requirements
- [ ] Write Lua script with proper error handling
- [ ] Test script with high concurrency
- [ ] Implement EVALSHA with fallback to EVAL
- [ ] Add monitoring and alerting
- [ ] Document rate limit policies
- [ ] Plan for Redis failures
- [ ] Load test under realistic conditions
- [ ] Set up Redis clustering if needed
- [ ] Configure appropriate TTLs and memory limits
