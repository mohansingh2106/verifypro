// const db3 = require('../config/db');


// await db3.query('INSERT INTO documents (employee_id, type, file_path) VALUES (?, ?, ?)', [employee_id, type, filePath]);


// // If all three types exist, set status to pending automatically
// const [docs] = await db3.query('SELECT type FROM documents WHERE employee_id = ?', [employee_id]);
// const types = docs.map(d => d.type);
// if (types.includes('selfie') && types.includes('cnicFront') && types.includes('cnicBack')) {
// await db3.query('UPDATE employees SET verification_status = ? WHERE id = ?', ['pending', employee_id]);
// }


// res.json({ success: true, filePath });
// } catch (err) {
// console.error(err);
// res.status(500).json({ error: 'Server error' });
// }
// };


// exports.submitVerification = async (req, res) => {
// try {
// const { uid } = req.body;
// const [rows] = await db3.query('SELECT id FROM employees WHERE uid = ?', [uid]);
// if (rows.length === 0) return res.status(404).json({ error: 'Employee not found' });
// const employee_id = rows[0].id;


// // Check files
// const [docs] = await db3.query('SELECT type FROM documents WHERE employee_id = ?', [employee_id]);
// const types = docs.map(d => d.type);
// if (!(types.includes('selfie') && types.includes('cnicFront') && types.includes('cnicBack'))) {
// return res.status(400).json({ error: 'All three documents are required' });
// }


// await db3.query('UPDATE employees SET verification_status = ? WHERE id = ?', ['pending', employee_id]);
// res.json({ success: true, status: 'pending' });
// } catch (err) {
// console.error(err);
// res.status(500).json({ error: 'Server error' });
// }
// };


// exports.adminVerify = async (req, res) => {
// try {
// const uid = req.params.uid;
// const [rows] = await db3.query('SELECT id FROM employees WHERE uid = ?', [uid]);
// if (rows.length === 0) return res.status(404).json({ error: 'Employee not found' });
// const employee_id = rows[0].id;


// await db3.query('UPDATE employees SET verification_status = ? WHERE id = ?', ['verified', employee_id]);
// res.json({ success: true, status: 'verified' });
// } catch (err) {
// console.error(err);
// res.status(500).json({ error: 'Server error' });
// }
// };


// exports.adminReject = async (req, res) => {
// try {
// const uid = req.params.uid;
// const notes = req.body.notes || null;
// const [rows] = await db3.query('SELECT id FROM employees WHERE uid = ?', [uid]);
// if (rows.length === 0) return res.status(404).json({ error: 'Employee not found' });
// const employee_id = rows[0].id;


// await db3.query('UPDATE employees SET verification_status = ? WHERE id = ?', ['rejected', employee_id]);
// // Optionally store notes in a separate table or in documents; omitted for simplicity
// res.json({ success: true, status: 'rejected', notes });
// } catch (err) {
// console.error(err);
// res.status(500).json({ error: 'Server error' });
// }
// };


const db3 = require("../config/db");

// Upload document
const uploadDocument = async (req, res) => {
  try {
    const { employee_id, type } = req.body;
    const filePath = req.file ? req.file.path : null;

    if (!filePath) {
      return res.status(400).json({ error: "File is required" });
    }

    await db3.query(
      "INSERT INTO documents (employee_id, type, file_path) VALUES (?, ?, ?)",
      [employee_id, type, filePath]
    );

    res.json({ message: "Document uploaded successfully" });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload document" });
  }
};

// Get documents by employee
const getDocuments = async (req, res) => {
  try {
    const { employee_id } = req.params;
    const [rows] = await db3.query(
      "SELECT * FROM documents WHERE employee_id = ?",
      [employee_id]
    );
    res.json(rows);
  } catch (error) {
    console.error("Get documents error:", error);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
};

module.exports = { uploadDocument, getDocuments };
