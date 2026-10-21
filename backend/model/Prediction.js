const express = require("express");
const route = express.Router();

const rawUrl = process.env.ML_SERVER_URL || "http://localhost:5000";
const ML_SERVER_URL = rawUrl.trim().replace(/\/+$/, "");

// Root info route
route.get("/", (req, res) => {
    res.json({
        message: "Trader's Street Prediction API is active",
        configured_ml_url: ML_SERVER_URL,
        available_endpoints: [
            "/predict/nifty50",
            "/predict/niftybank",
            "/predict/niftyit",
            "/predict/niftyauto",
            "/predict/niftynext"
        ]
    });
});

// Proxy to Python Flask prediction server on port 5000
route.get("/:modelKey", async (req, res) => {
    const { modelKey } = req.params;
    const targetUrl = `${ML_SERVER_URL}/predict/${modelKey}`;
    try {
        const response = await fetch(targetUrl);
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            return res.status(response.status).json(err);
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(`Prediction proxy error contacting ${targetUrl}:`, error);
        res.status(500).json({
            error: "Prediction server unavailable",
            target_url: targetUrl,
            details: error.message
        });
    }
});

// POST — custom 60-day data from user
route.post("/:modelKey", async (req, res) => {
    const { modelKey } = req.params;
    const targetUrl = `${ML_SERVER_URL}/predict/${modelKey}`;
    try {
        const response = await fetch(targetUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body),
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            return res.status(response.status).json(err);
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(`Prediction POST error contacting ${targetUrl}:`, error);
        res.status(500).json({
            error: "Prediction server unavailable",
            target_url: targetUrl,
            details: error.message
        });
    }
});

module.exports = route;
