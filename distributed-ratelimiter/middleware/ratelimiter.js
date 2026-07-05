import { checkRateLimit } from "../services/ratelimiterService.js";

export default async function rateLimiter(req, res, next) {
    try {
        const [canRequest,retryAfter,limit,remaining]= await checkRateLimit(req.ip);
        res.setHeader("X-RateLimit-Limit", limit);
        res.setHeader("X-RateLimit-Remaining", remaining);

        if (!canRequest) {
            res.setHeader("Retry-After", retryAfter);
            return res.status(429).json({
                success: false,
                message: "Too many requests"});
        }

        next(); 

    } catch (err) {
        next(err);
    }
}