const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const cors=require("cors");

const validateRoute    = require("./middleware/Searchvalidation");
const chartsdataRoute  = require("./model/Chartsdata");
const SearchRoute      = require("./model/Searchchart");
const PredictionRoute  = require("./model/Prediction");
const AuthRoute        = require("./Authentication/authRoutes");
const NewsRoute        = require("./model/News");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Trader's Street API is running", status: "ok" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth",    AuthRoute);
app.use("/news",    NewsRoute);
app.use("/validate",validateRoute);
app.use("/",        chartsdataRoute);
app.use("/search",  SearchRoute);
app.use("/predict", PredictionRoute);

// Global error handler
app.use((err, req, res, next) => {
    console.error("Server error:", err.message);
    res.status(500).json({ error: err.message || "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
