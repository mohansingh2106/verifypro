// // backend/config/db.js
// const mysql = require("mysql2/promise");

// // Create a promise-based pool (better for async/await)
// const pool = mysql.createPool({
//   host: process.env.DB_HOST || "localhost",
//   user: process.env.DB_USER || "root",
//   password: process.env.DB_PASS || "panther",
//   database: process.env.DB_NAME || "verifypro",
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// // Test connection once on startup
// (async () => {
//   try {
//     const connection = await pool.getConnection();
//     console.log("✅ MySQL Connected!");
//     connection.release();
//   } catch (err) {
//     console.error("❌ MySQL connection failed:", err.message);
//     process.exit(1);
//   }
// })();

// module.exports = pool;

// db.js — temporary version for Vercel until database is ready
console.log("⚠️ No database connection (running without MySQL).");

module.exports = {
  query: async () => {
    throw new Error("Database not connected — this is a mock module.");
  },
};
