require('dotenv').config();

const API_KEY = process.env.API_KEY || "02c1e5dc-e7a3-429d-8681-e3a5ea752bdf";

const authMiddleware = (req, res, next) => {
    const apiKey = req.header('scheduly-api-key');

    if (!apiKey) {
        return res.status(401).json({ error: "Unauthorized - API Key is missing" });
    }

    if (apiKey !== API_KEY) {
        return res.status(403).json({ error: "Forbidden - Invalid API Key" });
    }

    next(); // API Key is valid, proceed to the route
};

module.exports = authMiddleware;
