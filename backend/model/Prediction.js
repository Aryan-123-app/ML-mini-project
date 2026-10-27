const express = require("express");
const route = express.Router();

function normalizeMLServerUrl(url) {
    const clean = url.trim().replace(/\/+$/, "");
    if (/^https?:\/\//i.test(clean)) return clean;
    const protocol = clean.includes("localhost") || clean.includes("127.0.0.1") ? "http" : "https";
    return `${protocol}://${clean}`;
}

// Dynamic resolver: prefers local port 5000 when running locally, falls back to cloud ML service
async function resolveMLServerUrl() {
    const envUrl = process.env.ML_SERVER_URL?.trim();
    if (envUrl) {
        const clean = normalizeMLServerUrl(envUrl);
        if (clean.includes("localhost") || clean.includes("127.0.0.1")) {
            return clean;
        }
    }
    try {
        const localCheck = await fetch("http://localhost:5000/health", { signal: AbortSignal.timeout(400) });
        if (localCheck.ok) {
            return "http://localhost:5000";
        }
    } catch (_) {}

    return envUrl ? normalizeMLServerUrl(envUrl) : "https://trader-street-ml.onrender.com";
}

// Root info route
route.get("/", async (req, res) => {
    const currentUrl = await resolveMLServerUrl();
    res.json({
        message: "Trader's Street Prediction API is active",
        configured_ml_url: currentUrl,
        available_endpoints: [
            "/predict/nifty50",
            "/predict/niftybank",
            "/predict/niftyit",
            "/predict/niftyauto",
            "/predict/niftynext"
        ]
    });
});

// Proxy to Python Flask prediction server
route.get("/:modelKey", async (req, res) => {
    const { modelKey } = req.params;
    const baseUrl = await resolveMLServerUrl();
    const targetUrl = `${baseUrl}/predict/${modelKey}`;
    try {
        const response = await fetch(targetUrl);
        if (!response.ok) {
            let errorMsg = "Prediction server returned an error";
            try {
                const errData = await response.json();
                errorMsg = errData.error || errData.message || JSON.stringify(errData);
            } catch (_) {
                const text = await response.text().catch(() => "");
                errorMsg = `ML Server error (${response.status}): ${text.slice(0, 100)}`;
            }
            return res.status(response.status).json({ error: errorMsg });
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(`Prediction proxy error contacting ${targetUrl}:`, error.message);
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
    const baseUrl = await resolveMLServerUrl();
    const targetUrl = `${baseUrl}/predict/${modelKey}`;
    try {
        const response = await fetch(targetUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body),
        });
        if (!response.ok) {
            let errorMsg = "Prediction server returned an error";
            try {
                const errData = await response.json();
                errorMsg = errData.error || errData.message || JSON.stringify(errData);
            } catch (_) {
                const text = await response.text().catch(() => "");
                errorMsg = `ML Server error (${response.status}): ${text.slice(0, 100)}`;
            }
            return res.status(response.status).json({ error: errorMsg });
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(`Prediction POST error contacting ${targetUrl}:`, error.message);
        res.status(500).json({
            error: "Prediction server unavailable",
            target_url: targetUrl,
            details: error.message
        });
    }
});

module.exports = route;
