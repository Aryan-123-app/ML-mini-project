const path   = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGO_URI;
let client;

async function connectDB() {
    try {
        if (!uri) {
            throw new Error("MONGO_URI is not configured. Set it in backend/.env or the project root .env.");
        }

        client ??= new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                // strict: true,
                deprecationErrors: true,
            }
        });
        await client.connect();
        console.log("✅ MongoDB connected!");
        return client.db("Trader's_street");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        throw err;
    }
}

module.exports = connectDB;