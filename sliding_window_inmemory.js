const express = require("express");

const app = express();
app.use(express.json());

const WINDOW_SIZE = 60 * 1000; // 1 minute
const REQUEST_LIMIT = 5;

const rateLimitStore = new Map();

/**
 * Cleanup expired IPs periodically
 */
setInterval(() => {
    const now = Date.now();

    for (const [ip, timestamps] of rateLimitStore.entries()) {
        if (
            timestamps.length === 0 ||
            now - timestamps[timestamps.length - 1] >= WINDOW_SIZE
        ) {
            rateLimitStore.delete(ip);
        }
    }
}, WINDOW_SIZE);

function slidingWindowLimiter(req, res, next) {
    const ip = req.ip;
    const currentTime = Date.now();

    // Get timestamps for IP
    let timestamps = rateLimitStore.get(ip);

    // First request
    if (!timestamps) {
        rateLimitStore.set(ip, [currentTime]);
        return next();
    }

    // Remove expired timestamps
    const threshold = currentTime - WINDOW_SIZE;

    let removeCount = 0;

    for (const timestamp of timestamps) {
        if (timestamp < threshold) {
            removeCount++;
        } else {
            break;
        }
    }

    if (removeCount > 0) {
        timestamps.splice(0, removeCount);
    }

    // Check rate limit
    if (timestamps.length >= REQUEST_LIMIT) {
        return res.status(429).json({
            status: 429,
            message: "Too many requests",
        });
    }

    // Record current request
    timestamps.push(currentTime);

    return next();
}

app.use(slidingWindowLimiter);

app.get("/api", (req, res) => {
    res.json({
        status: 200,
        message: "Request successful",
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});