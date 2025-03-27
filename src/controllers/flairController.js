const { getFlairAirlinesData } = require('../models/flairModel');

const fetchFlairAirlines = async (req, res) => {
    try {
        const { date } = req.query; // Extract date from query params
        if (!date) {
            return res.status(400).json({ error: "Date parameter is required" });
        }

        const data = await getFlairAirlinesData(date);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Server Error", details: error.message });
    }
};

module.exports = { fetchFlairAirlines };
