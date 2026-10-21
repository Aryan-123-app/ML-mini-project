const dotenv = require("dotenv");
dotenv.config();

const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGO_URI || "mongodb+srv://aryanpatade8_db_user:5vlllem2iC9rJMkM@cluster0.ylighsl.mongodb.net/";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        // strict: true,
        deprecationErrors: true,
    }
});

async function connectDB() {
    try {
        await client.connect();
        console.log("✅ MongoDB connected!");
        return client.db("Trader's_street");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        throw err;
    }
}

module.exports = connectDB;