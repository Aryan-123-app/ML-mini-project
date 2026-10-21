const mongoose = require("mongoose");
const dotenv   = require("dotenv");
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://aryanpatade8_db_user:5vlllem2iC9rJMkM@cluster0.ylighsl.mongodb.net/";

let connected = false;

async function connectMongoose() {
    if (connected) return;
    try {
        await mongoose.connect(MONGO_URI);
        connected = true;
        console.log("✅ Mongoose connected (Users)");
    } catch (err) {
        console.error("❌ Mongoose connection error:", err.message);
        throw err;
    }
}

module.exports = connectMongoose;
