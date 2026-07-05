# Rate Limiter Implementations

A collection of rate limiting implementations in Node.js, demonstrating different algorithms and architectures.

## 📁 Project Structure

### 1. In-Memory Rate Limiters
Simple, single-instance rate limiters for development and learning:

- **`fixed_window_inmemory.js`** - Fixed window counter algorithm
- **`sliding_window_inmemory.js`** - Sliding window log algorithm
- **`ratelimit_distributed.js`** - Distributed implementation example

### 2. Distributed Rate Limiter (`distributed-ratelimiter/`)
Production-ready, Redis-backed distributed rate limiter for Express.js applications.

**Features:**
- Sliding window log algorithm
- Atomic operations using Lua scripts
- Works across multiple server instances
- Standard HTTP rate limit headers
- IP-based limiting

[See detailed documentation](distributed-ratelimiter/README.md)

## 🚀 Quick Start

### In-Memory Examples

Run individual rate limiter scripts:

```bash
node fixed_window_inmemory.js
node sliding_window_inmemory.js
node ratelimit_distributed.js
```

### Distributed Rate Limiter

1. Start Redis server:
```bash
redis-server
```

2. Navigate to the distributed implementation:
```bash
cd distributed-ratelimiter
npm install
node index.js
```

3. Test with load script:
```bash
node loadTest.js
```

## 📊 Algorithm Comparison

| Algorithm | Accuracy | Memory | Use Case |
|-----------|----------|--------|----------|
| Fixed Window | Low | Very Low | Simple apps, approximate limiting |
| Sliding Window Log | High | Medium | Precise limiting, moderate traffic |
| Sliding Window Counter | Medium | Low | Balance of accuracy and efficiency |

## 🛠️ Technologies

- **Node.js** 20.11.0+
- **Express.js** - Web framework
- **Redis** - Distributed state management
- **Lua** - Atomic Redis operations

## 📚 Learning Resources

Each implementation demonstrates different trade-offs:

- **Fixed Window**: Simplest implementation, but allows burst traffic at window boundaries
- **Sliding Window Log**: Most accurate, but uses more memory to store individual request timestamps
- **Distributed**: Production-ready solution that works across multiple servers

## 🔧 Configuration

Rate limiting parameters can be configured in each implementation:

- **Window Size**: Time window for counting requests (e.g., 1 minute)
- **Max Requests**: Maximum number of requests allowed per window
- **Redis URL**: Connection string for Redis (distributed version only)

## 📦 Dependencies

See individual `package.json` files for specific dependencies:
- Root level: Shared dependencies for simple examples
- `distributed-ratelimiter/`: Full Express app with Redis

## 🚀 Deployment

For production use, the distributed rate limiter is recommended. Key considerations:

- **Proxy Configuration**: Set `trust proxy` in Express if behind a load balancer
- **Redis HA**: Use Redis Cluster or Sentinel for high availability
- **Rate Limit Strategy**: Adjust window size and limits based on your API requirements
- **Monitoring**: Track 429 responses and rate limit rejections

## 📝 License

ISC

## 👤 Author

Rushma Chikkala

## 🤝 Contributing

Feel free to explore, learn, and adapt these implementations for your needs!
