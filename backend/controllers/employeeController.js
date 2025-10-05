const db2 = require('../config/db');


exports.listEmployees = async (req, res) => {
try {
const [rows] = await db2.query('SELECT id, uid, full_name AS name, email, verification_status, created_at FROM employees ORDER BY id DESC');
res.json(rows);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Server error' });
}
};


exports.getEmployeeByUID = async (req, res) => {
try {
const uid = req.params.uid;
const [rows] = await db2.query('SELECT * FROM employees WHERE uid = ?', [uid]);
if (rows.length === 0) return res.status(404).json({ error: 'Employee not found' });
const employee = rows[0];


const [docs] = await db2.query('SELECT type, file_path FROM documents WHERE employee_id = ?', [employee.id]);
const [work] = await db2.query('SELECT company, position, start_date, end_date, description FROM work_history WHERE employee_id = ?', [employee.id]);


res.json({ employee, documents: docs, work_history: work });
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Server error' });
}
};