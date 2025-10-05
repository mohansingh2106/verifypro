const db = require('../config/db');
const bcrypt = require('bcrypt');
const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('0123456789', 6);


async function generateUniqueUID() {
while (true) {
const uid = `EMP${nanoid()}`;
const [rows] = await db.query('SELECT id FROM employees WHERE uid = ?', [uid]);
if (rows.length === 0) return uid;
}
}


exports.register = async (req, res) => {
try {
const { fullName, email, password, dateOfBirth, address } = req.body;
if (!fullName) return res.status(400).json({ error: 'Full name required' });


// optional: hash password even if not used for auth
let hashed = '';
if (password) {
const salt = await bcrypt.genSalt(10);
hashed = await bcrypt.hash(password, salt);
}


const uid = await generateUniqueUID();


const [result] = await db.query(
'INSERT INTO employees (uid, full_name, email, password, date_of_birth, address) VALUES (?, ?, ?, ?, ?, ?)',
[uid, fullName, email || null, hashed, dateOfBirth || null, address || null]
);


res.json({ success: true, uid });
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Server error' });
}
};