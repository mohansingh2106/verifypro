# VerifyPro Backend (Node + Express + MySQL)
2. Copy `.env.example` to `.env` and update values:


```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=panther
DB_NAME=verifypro
DB_PORT=3306
PORT=5000
UPLOAD_DIR=uploads
```


3. Initialize DB (run from command prompt where mysql is accessible):


```sql
mysql -u root -ppanther < db_init.sql
```


Or paste the contents of `db_init.sql` into your mysql prompt after connecting.


4. Install dependencies:


```bash
npm install
```


5. Start server:


```bash
npm run dev
# or
node server.js
```


6. Server runs at: http://localhost:5000


API base: http://localhost:5000/api


---


## Important endpoints (examples)


- Register user:
POST /api/register
Body (JSON): { fullName, email, password, dateOfBirth, address }


- List employees:
GET /api/employees


- Get employee by UID:
GET /api/employee/:uid


- Upload document:
POST /api/upload/:uid/:type (type = selfie | cnicFront | cnicBack)
Form field name: `file` (multipart/form-data)


- Submit verification (mark pending):
POST /api/verification/submit body { uid }


- Admin verify:
POST /api/verify/:uid


- Admin reject:
POST /api/reject/:uid body { notes }


---