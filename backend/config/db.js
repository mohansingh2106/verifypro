const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

// 🧩 Skip MySQL connection on Vercel
if (process.env.VERCEL) {
  console.log("⚙️ Running on Vercel — Skipping MySQL connection");
  module.exports = null;
} else {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "verifypro",
  });

  pool.getConnection()
    .then(() => console.log("✅ MySQL connected successfully"))
    .catch((err) => console.error("❌ MySQL connection failed:", err.message));

  module.exports = pool;
}
