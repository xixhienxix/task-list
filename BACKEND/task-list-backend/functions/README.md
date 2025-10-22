# Task List Backend (Firebase Functions + Express)

This is a Firebase Cloud Functions backend for a task management application. It uses **Express** for routing, **Firestore** as the database, and **CORS** for cross-origin requests.

---

## **Project Structure**

```
functions/
├─ index.js          # Main entry point
├─ routes/
│  ├─ auth.js        # Authentication routes
│  └─ tasks.js       # Task management routes
├─ package.json
├─ package-lock.json
├─ node_modules/
└─ README.md
firebase.json
.firebaserc
```

---

## **Installation**

1. Clone the repository and navigate to the backend folder:

```bash
git clone <your-repo-url>
cd task-list-backend/functions
```

2. Install dependencies:

```bash
npm install
```

3. Deploy to Firebase:

```bash
cd ..
firebase deploy --only functions
```

> Make sure your Firebase project is set up and you are logged in using `firebase login`.

---

## **API Endpoints**

### **Health Check**

```
GET /health
```

Returns a simple string to check if the API is running.

```json
"API Running!"
```

---

### **Authentication Routes (`/auth`)**

#### **POST /login**

Check if a user exists by email.

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:**

- Success:

```json
{
  "success": true,
  "id": "<userId>",
  "email": "user@example.com",
  "name": "User Name"
}
```

- Error (email required or not registered):

```json
{
  "errorCode": 40,
  "message": "Usuario no registrado, registese antes de poder acceder"
}
```

---

#### **POST /register**

Register a new user.

**Request Body:**

```json
{
  "email": "user@example.com",
  "name": "User Name"
}
```

**Response:**

- Success:

```json
{
  "success": true,
  "id": "<newUserId>",
  "email": "user@example.com",
  "name": "User Name"
}
```

- Error (already exists or missing email):

```json
{
  "errorCode": 42,
  "message": "El usuario ya existe!"
}
```

---

### **Tasks Routes (`/tasks`)**

#### **GET /tasks**

Get all tasks.

**Response:**

```json
{
  "success": true,
  "tasks": [
    {
      "id": "<taskId>",
      "titulo": "Task Title",
      "descripcion": "Task Description",
      "fecha_creacion": "2025-10-21T22:13:00Z",
      "estado": false
    }
  ]
}
```

#### **POST /tasks**

Add a new task.

**Request Body:**

```json
{
  "titulo": "New Task",
  "descripcion": "Description",
  "estado": false
}
```

**Response:**

```json
{
  "success": true,
  "id": "<newTaskId>",
  "titulo": "New Task",
  "descripcion": "Description",
  "estado": false,
  "fecha_creacion": "2025-10-21T22:13:00Z"
}
```

#### **PUT /tasks/:id**

Update a task by ID.

**Request Body:** Any of the fields: `titulo`, `descripcion`, `estado`.

**Response:**

```json
{
  "success": true,
  "id": "<taskId>",
  "titulo": "Updated Task",
  "descripcion": "Updated Description",
  "estado": true,
  "message": "Tarea actualizada correctamente"
}
```

#### **DELETE /tasks/:id**

Delete a task by ID.

**Response:**

```json
{
  "success": true,
  "id": "<taskId>",
  "message": "Tarea eliminada correctamente"
}
```

---

## **Firebase Functions (`index.js`)**

```javascript
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

admin.initializeApp();
const db = admin.firestore();

const app = express();

app.use(cors({origin: true}));
app.use(express.json());

const authRouter = require("./routes/auth")(db);
app.use("/", authRouter);

const tasksRouter = require("./routes/tasks")(db);
app.use("/", tasksRouter);

app.get("/health", (req, res) => res.send("API Running!"));

exports.api = functions.https.onRequest(app);
```

---

## **Routes Overview**

- `routes/auth.js`: Handles login and registration.
- `routes/tasks.js`: Handles CRUD operations for tasks.

---

This README gives a **full overview of the backend** so you or other developers can run, test, and deploy it easily.

