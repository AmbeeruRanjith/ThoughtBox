const RateLimit = require("../models/RateLimit");

// Limit: 5 actions per 1 minute
const LIMIT_DURATION = 60 * 1000; // 1 minute
const MAX_ACTIONS = 5;

const rateLimiter = (actionType) => async (req, res, next) => {
    try {
        if (!req.user) return next(); // Should be protected, but safe check

        const userId = req.user._id;
        const now = new Date();
        const windowStart = new Date(now - LIMIT_DURATION);

        // Find valid rate limit doc or create one
        // We look for a record updated within the last window
        let limitDoc = await RateLimit.findOne({
            user: userId,
            action: actionType,
        });

        if (!limitDoc) {
            limitDoc = await RateLimit.create({
                user: userId,
                action: actionType,
                count: 1,
                lastActionTime: now,
            });
            return next();
        }

        // Check if the window has reset
        if (limitDoc.lastActionTime < windowStart) {
            // Reset window
            limitDoc.count = 1;
            limitDoc.lastActionTime = now;
            await limitDoc.save();
            return next();
        }

        // Check limit
        if (limitDoc.count >= MAX_ACTIONS) {
            return res.status(429).json({
                message: `Rate limit exceeded for ${actionType}. Please wait a moment.`,
            });
        }

        // Increment
        limitDoc.count += 1;
        limitDoc.lastActionTime = now;
        await limitDoc.save();

        next();
    } catch (error) {
        console.error("Rate limit error:", error);
        next(); // Don't block if redis/db fails, fail open
    }
};

module.exports = rateLimiter;
