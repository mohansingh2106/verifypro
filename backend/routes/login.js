const express = require("express");
const router = express.Router();
const db = require("../config/db");

// 🔹 Employee Login Route
router.post("/", async (req, res) => {
  try {
    const { uid, password } = req.body;

    if (!uid) {
      return res.status(400).json({ success: false, message: "Employee UID is required" });
    }

    // Find employee by UID
    const [rows] = await db.query("SELECT * FROM employees WHERE employee_uid = ?", [uid]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    const employee = rows[0];

    // If password column is empty or not required
    if (!employee.password) {
      return res.json({ success: true, employee });
    }

    // Simple password match (no hashing yet)
    if (employee.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    return res.json({ success: true, employee });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
