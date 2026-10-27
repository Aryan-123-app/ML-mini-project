const path     = require("path");
const mongoose = require("mongoose");
const dotenv   = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const MONGO_URI = process.env.MONGO_URI;

let connected = false;
let connectionPromise;

function connectMongoose() {
    if (connected) return;
    if (!MONGO_URI) {
        return Promise.reject(new Error("MONGO_URI is not configured. Set it in backend/.env or the project root .env."));
    }

    if (!connectionPromise) {
        connectionPromise = mongoose.connect(MONGO_URI)
            .then(() => {
                connected = true;
                console.log("✅ Mongoose connected (Users)");
            })
            .catch((err) => {
                connectionPromise = undefined;
                console.error("❌ Mongoose connection error:", err.message);
                throw err;
            });
    }

    return connectionPromise;
}

module.exports = connectMongoose;
