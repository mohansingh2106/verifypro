const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all employees
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM employees");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching employees" });
  }
});

// GET employee by UID
router.get("/:uid", async (req, res) => {
  try {
    const { uid } = req.params;

    // Query employee details
    const [rows] = await db.query("SELECT * FROM employees WHERE employee_uid = ?", [uid]);

    if (!rows.length) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const employee = rows[0];

    // (Optional) Later join work history & documents
    res.json({
      employee: {
        uid: employee.employee_uid,
        full_name: employee.fullName,
        email: employee.email,
        phone: employee.phone || null,
        address: employee.address,
        location: employee.address, // reuse for now
        bio: employee.bio || null,
        avatar: employee.avatar || null,
        verification_status: "unverified", // hardcoded until verification flow
      },
      work_history: [],
      documents: [],
    });
  } catch (err) {
    console.error("Error fetching employee:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
