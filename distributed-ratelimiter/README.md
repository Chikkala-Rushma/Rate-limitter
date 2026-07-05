# Distributed Rate Limiter

A production-ready, Redis-backed distributed rate limiter for Express.js applications using the sliding window log algorithm.

## Features

- **Sliding Window Log Algorithm**: Precise rate limiting with no boundary issues
- **Distributed**: Works across multiple server instances using Redis
- **Atomic Operations**: Lua scripts ensure thread-safe, race-condition-free limiting
- **HTTP Headers**: Standard `X-RateLimit-*` and `Retry-After` headers
- **IP-based**: Rate limits based on client IP addresses

## Prerequisites

- Node.js 20.11.0 or higher
- Redis server (local or remote)

## Installation

```bash
npm install
```

## Configuration

The rate limiter is configured in `services/ratelimiterService.js`:

```javascript
const windowSizeInMs = 60 * 1000; // 1 minute
const maxRequests = 5; // Maximum requests allowed in the window
```

Redis connection is configured in `config/redisClient.js`:

```javascript
const redisClient = createClient({
  url: "redis://localhost:6379",
});
```

## Usage

### Starting the Server

```bash
node index.js
```

The server runs on port 3000 by default.

### Testing with Load Test

Run the included load test to verify rate limiting:

```bash
node loadTest.js
```

This sends 20 concurrent requests. You should see:
- First 5 requests: `200 OK`
- Remaining 15 requests: `429 Too Many Requests` with `Retry-After` header

## How It Works

### Sliding Window Log Algorithm

The rate limiter uses a sorted set in Redis (ZSET) to store request timestamps:

1. Remove expired timestamps outside the current window
2. Count remaining requests in the window
3. If under the limit, add the current request with its timestamp
4. If over the limit, reject with retry-after calculation

### Atomicity

All Redis operations are performed atomically using a Lua script (`scripts/ratelimitter.lua`) to prevent race conditions in distributed environments.

## API

### Rate Limit Response Headers

Every response includes these headers:

- `X-RateLimit-Limit`: Maximum requests allowed per window
- `X-RateLimit-Remaining`: Requests remaining in current window
- `Retry-After`: (on 429 only) Seconds until the next request will be allowed

### Example Responses

**Success (200)**
```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 3
```

**Rate Limited (429)**
```json
{
  "success": false,
  "message": "Too many requests"
}
```
```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
Retry-After: 45
```

## Project Structure

```
distributed-ratelimiter/
├── config/
│   └── redisClient.js       # Redis connection setup
├── middleware/
│   └── ratelimiter.js       # Express middleware
├── redis/
│   └── redisService.js      # Redis operations wrapper
├── routes/
│   └── apiRoutes.js         # API endpoints
├── scripts/
│   └── ratelimitter.lua     # Atomic rate limiting logic
├── services/
│   └── ratelimiterService.js # Rate limiting service
├── index.js                  # Server entry point
└── loadTest.js              # Load testing script
```

## Deployment Considerations

### Proxy Setup

If deploying behind a reverse proxy (Nginx, load balancer, etc.), configure Express to trust proxy headers:

```javascript
app.set('trust proxy', true);
```

This ensures `req.ip` contains the real client IP, not the proxy IP.

### Production Redis

For production, use:
- Redis with persistence (AOF or RDB)
- Redis Cluster or Sentinel for high availability
- TLS for secure connections
- Authentication enabled

## License

ISC

## Author

Rushma Chikkala
