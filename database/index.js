const { Pool } = require("pg");
require("dotenv").config();

// Use SSL in production (Render requires it)
const useSSL = process.env.NODE_ENV === "production";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: useSSL ? { rejectUnauthorized: false } : false,
});

// Export a unified query function
module.exports = {
    query: async (text, params) => {
        try {
            const res = await pool.query(text, params);
            if (process.env.NODE_ENV === "development") {
                console.log("executed query", { text });
            }
            return res;
        } catch (err) {
            console.error("Database query error", { text, err });
            throw err;
        }
    },
    pool,
};
