const express = require('express');
const { fetchFlairAirlines } = require('../controllers/flairController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Apply API Key Authentication
router.get('/flairairlines', authMiddleware, fetchFlairAirlines);

module.exports = router;
