# 📝 Noteverse

**Noteverse** is a full-stack notes management web application that allows users to securely create, edit, and delete their personal notes.  
It provides user authentication, robust error handling, rich text editing, application logging, and automated testing — built for both performance and reliability.

---

## 🚀 Project Overview

The goal of **Noteverse** is to deliver a seamless note-taking experience with complete privacy and maintainability.  
It includes **frontend and backend integration**, **unit testing**, **logging**, and **database connectivity** using **MySQL**.

---

## 🧠 Features

### 🔐 User Authentication & Authorization
- Secure signup, login, and logout.
- User-specific notes — each user can only view and manage their own.
- JWT-based authentication.

### 🗒️ Notes Management
- Create, edit, and delete notes.
- Rich text editor for enhanced note formatting.
- Responsive UI built with React and Vite.

### 🧪 Unit Testing
- **Frontend:** Tested with **Vitest** and React Testing Library.
- **Backend:** Tested with **Vitest** and Supertest for API endpoints.
- Focus on controllers, services, and database logic.

### 📊 Code Quality (SonarQube)
- Integrated **SonarQube** for static code analysis.
- Code quality metrics and linting for cleaner and safer code.

### 🗄️ Database
- **MySQL** used for data persistence.
- Stores users, notes, and related data.
- Designed with relational schema for scalability.

### ⚙️ Version Control (Git)
- Proper branching and merging strategies.
- Organized commits for feature and bug tracking.

---

## 🖥️ Technology Stack

| Layer | Technology |
|:------|:------------|
| **Frontend** | React.js (Vite) |
| **Backend** | Node.js (Express.js) |
| **Database** | MySQL |
| **Testing** | Vitest |
| **Code Quality** | SonarQube |
| **Version Control** | Git & GitHub |

---

## 🧩 Application Structure

### Frontend (React + Vite)
- Interactive dashboard showing user notes.
- Rich text editor for note creation.
- Responsive design for desktop & mobile.
- API integration with Node.js backend.

### Backend (Node.js + Express)
- RESTful API for CRUD operations.
- Authentication middleware using JWT.
- Integrated Pino Logger for structured logs.
- MySQL database interaction via ORM or query builder.

---

## 🧭 Screens Overview

### 🟢 Sign Up / Log In
- **Components:** Sign-up form, Login form  
- **Operations:** Register new user, authenticate existing user, redirect to dashboard.

### 🟡 Dashboard
- **Components:** List of user-specific notes, “Create New Note” button.  
- **Operations:** Fetch user notes, view all, navigate to note editor.

### 🔵 Note Editor
- **Components:** Rich text editor, Save/Cancel buttons.  
- **Operations:** Create or edit notes, save to backend, return to dashboard.

### ⚪ User Profile *(optional)*
- **Components:** User details, Logout button.  
- **Operations:** View profile info, securely log out.

---

## 🧰 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/noteverse.git
cd noteverse
