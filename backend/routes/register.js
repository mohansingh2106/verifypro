const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Register new employee
router.post("/", async (req, res) => {
  try {
    const { fullName, email, password, dateOfBirth, address } = req.body;

    if (!fullName || !email || !password || !dateOfBirth || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Generate UID
    const timestamp = Date.now().toString().slice(-6);
    const employee_uid = `EMP${timestamp}`;

    const sql = `INSERT INTO employees (employee_uid, fullName, email, password, dateOfBirth, address)
                 VALUES (?, ?, ?, ?, ?, ?)`;

    await db.query(sql, [employee_uid, fullName, email, password, dateOfBirth, address]);

    res.json({
      message: "Registration successful",
      employee_uid,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
