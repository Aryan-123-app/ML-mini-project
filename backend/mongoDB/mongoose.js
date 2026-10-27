const path     = require("path");
const mongoose = require("mongoose");
const dotenv   = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const MONGO_URI = process.env.MONGO_URI;

let connected = false;

async function connectMongoose() {
    if (connected) return;
    try {
        if (!MONGO_URI) {
            throw new Error("MONGO_URI is not configured. Set it in backend/.env or the project root .env.");
        }
        await mongoose.connect(MONGO_URI);
        connected = true;
        console.log("✅ Mongoose connected (Users)");
    } catch (err) {
        console.error("❌ Mongoose connection error:", err.message);
        throw err;
    }
}

module.exports = connectMongoose;
