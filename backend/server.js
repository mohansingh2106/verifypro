const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

console.log("✅ VerifyPro backend starting...");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Determine upload directory (Vercel-safe)
const UPLOAD_DIR =
  process.env.NODE_ENV === 'production'
    ? '/tmp/uploads' // Vercel uses temporary storage
    : path.join(__dirname, 'uploads');

// ✅ Create uploads directory only when possible
try {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    console.log(`Created upload directory: ${UPLOAD_DIR}`);
  }
} catch (err) {
  console.error("Error creating upload directory:", err);
}

// ✅ Test route only (disable all others temporarily)
app.get("/", (req, res) => {
  res.send("✅ VerifyPro Backend is Live (No DB Connected Yet)");
});

// ❌ Temporarily disable routes
// const registerRoutes = require('./routes/register');
// const employeeRoutes = require('./routes/employee');
// const verificationRoutes = require('./routes/verification');
// const loginRoutes = require('./routes/login');

// app.use("/register", registerRoutes);
// app.use("/employees", employeeRoutes);
// app.use("/verify", verificationRoutes);
// app.use("/login", loginRoutes);

// ✅ Serve uploads locally only
if (process.env.NODE_ENV !== 'production') {
  app.use('/uploads', express.static(UPLOAD_DIR));
}

// ✅ Start server locally only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

console.log("✅ VerifyPro backend initialized successfully!");

// ✅ Export app for Vercel
module.exports = app;
