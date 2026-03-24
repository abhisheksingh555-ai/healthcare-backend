# 🏥 Healthcare Backend

A full-stack healthcare management system built with **Node.js**, **Express**, **EJS**, **PostgreSQL**, and **JWT authentication** — mirroring the Django assignment spec exactly.

---

## 🧱 Tech Stack

| Layer        | Technology                        |
|--------------|-----------------------------------|
| Runtime      | Node.js                           |
| Framework    | Express.js                        |
| Templating   | EJS (Embedded JavaScript)         |
| Database     | PostgreSQL via Sequelize ORM       |
| Auth         | JWT (jsonwebtoken) + bcryptjs     |
| Validation   | express-validator                 |
| Env          | dotenv                            |

---

## 📁 Project Structure

```
healthcare-backend/
├── src/
│   ├── app.js                    # Entry point
│   ├── config/
│   │   └── database.js           # Sequelize/PostgreSQL config
│   ├── controllers/
│   │   ├── authController.js     # Register, Login (API + Web)
│   │   ├── patientController.js  # Patient CRUD (API + Web)
│   │   ├── doctorController.js   # Doctor CRUD (API + Web)
│   │   └── mappingController.js  # Patient-Doctor mapping (API + Web)
│   ├── middleware/
│   │   ├── auth.js               # JWT middleware (API + Web)
│   │   ├── validators.js         # express-validator rules
│   │   └── errorHandler.js       # Global error handler
│   ├── models/
│   │   ├── index.js              # Associations
│   │   ├── User.js
│   │   ├── Patient.js
│   │   ├── Doctor.js
│   │   └── Mapping.js
│   ├── routes/
│   │   ├── api.js                # REST API routes (/api/*)
│   │   └── web.js                # EJS web routes
│   ├── views/                    # EJS templates
│   │   ├── partials/
│   │   │   ├── header.ejs
│   │   │   ├── footer.ejs
│   │   │   └── alerts.ejs
│   │   ├── auth/
│   │   │   ├── login.ejs
│   │   │   └── register.ejs
│   │   ├── patients/
│   │   │   ├── index.ejs
│   │   │   ├── show.ejs
│   │   │   └── form.ejs
│   │   ├── doctors/
│   │   │   ├── index.ejs
│   │   │   ├── show.ejs
│   │   │   └── form.ejs
│   │   ├── mappings/
│   │   │   └── index.ejs
│   │   ├── dashboard.ejs
│   │   └── error.ejs
│   └── public/
│       ├── css/style.css
│       └── js/main.js
├── .env                          # Environment variables (git-ignored)
├── .env.example                  # Template for env vars
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone & Install

```bash
git clone <your-repo>
cd healthcare-backend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=healthcare_db
DB_USER=postgres
DB_PASSWORD=your_password_here

JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

APP_NAME=Healthcare Backend
```

### 3. Create PostgreSQL Database

```sql
CREATE DATABASE healthcare_db;
```

### 4. Start the Server

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Tables are auto-created via `sequelize.sync({ alter: true })` on startup.

---

## 🌐 Web Interface

Visit `http://localhost:3000` in your browser.

| Page        | URL                    |
|-------------|------------------------|
| Login       | /auth/login            |
| Register    | /auth/register         |
| Dashboard   | /dashboard             |
| Patients    | /patients              |
| Doctors     | /doctors               |
| Mappings    | /mappings              |

---

## 🔌 REST API Endpoints

All API routes are prefixed with `/api`. Protected routes require `Authorization: Bearer <token>` header.

### 🔐 Auth

| Method | Endpoint              | Auth | Description          |
|--------|-----------------------|------|----------------------|
| POST   | /api/auth/register    | No   | Register a new user  |
| POST   | /api/auth/login       | No   | Login & get JWT      |

**Register body:**
```json
{ "name": "John Doe", "email": "john@example.com", "password": "secret123" }
```

**Login body:**
```json
{ "email": "john@example.com", "password": "secret123" }
```

**Login response:**
```json
{ "success": true, "token": "eyJ...", "user": { "id": 1, "name": "John", "email": "..." } }
```

---

### 🧑‍⚕️ Patients (Protected)

| Method | Endpoint            | Description                  |
|--------|---------------------|------------------------------|
| POST   | /api/patients       | Create a new patient         |
| GET    | /api/patients       | Get all patients (yours)     |
| GET    | /api/patients/:id   | Get patient by ID            |
| PUT    | /api/patients/:id   | Update patient               |
| DELETE | /api/patients/:id   | Delete patient               |

**Create/Update body:**
```json
{
  "name": "Alice Smith",
  "age": 32,
  "gender": "female",
  "contact": "+91 9876543210",
  "address": "123 Main St, Delhi",
  "medical_history": "Diabetic, allergic to penicillin"
}
```

---

### 👨‍⚕️ Doctors (Protected)

| Method | Endpoint           | Description          |
|--------|--------------------|----------------------|
| POST   | /api/doctors       | Create a new doctor  |
| GET    | /api/doctors       | Get all doctors      |
| GET    | /api/doctors/:id   | Get doctor by ID     |
| PUT    | /api/doctors/:id   | Update doctor        |
| DELETE | /api/doctors/:id   | Delete doctor        |

**Create/Update body:**
```json
{
  "name": "Dr. Sarah Johnson",
  "specialization": "Cardiologist",
  "contact": "+91 9123456789",
  "email": "sarah@hospital.com",
  "experience_years": 12
}
```

---

### 🔗 Mappings (Protected)

| Method | Endpoint                    | Description                      |
|--------|-----------------------------|----------------------------------|
| POST   | /api/mappings               | Assign a doctor to a patient     |
| GET    | /api/mappings               | Get all mappings                 |
| GET    | /api/mappings/:patient_id   | Get all doctors for a patient    |
| DELETE | /api/mappings/:id           | Remove a doctor from a patient   |

**Create body:**
```json
{ "patient_id": 1, "doctor_id": 2, "notes": "Primary cardiologist" }
```

---

## 🧪 Testing with Postman

1. **Register** → POST `/api/auth/register`
2. **Login** → POST `/api/auth/login` → copy the `token`
3. For all protected routes, add header:
   ```
   Authorization: Bearer <your_token>
   ```
4. Test all CRUD operations for patients, doctors, and mappings.

---

## 🔒 Security Features

- Passwords hashed with **bcryptjs** (salt rounds: 12)
- JWT tokens expire after **7 days**
- Patient records are **user-scoped** (you only see your own)
- All inputs validated with **express-validator**
- Environment variables for all secrets
- HTTP-only cookies for web session tokens

---

## 📜 License

MIT
