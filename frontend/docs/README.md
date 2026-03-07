# ☕ BrewBatch — Inventory & Order Management for Coffee Shops

> **IT342 Laboratory 1 | Group 5**
> A full-stack application to streamline inventory tracking and order management for coffee shops.

---

## 📌 Project Description

BrewBatch is a full-stack web application built to help coffee shop owners and staff efficiently manage their day-to-day operations. The system provides:

- **Secure user authentication** using JWT tokens
- **Inventory management** to track coffee beans, syrups, cups, and supplies
- **Order tracking** from placement to completion
- **Role-based access** for admins and regular staff
- **Real-time dashboard** with key metrics at a glance

---

## 🛠️ Technologies Used

| Layer      | Technology                          |
|------------|-------------------------------------|
| Backend    | Spring Boot 3.x, Spring Security 6  |
| Database   | MySQL 8.x, Spring Data JPA, Hibernate |
| Auth       | JWT (jjwt 0.11.5), BCrypt           |
| Frontend   | React 18, React Router v6           |
| HTTP       | Axios                               |
| Build      | Maven (backend), npm (frontend)     |
| IDE        | VS Code + Java Extension Pack       |

---

## 📁 Project Structure

```
IT342_G5_Lastname_Lab1/
├── backend/                         # Spring Boot application
│   ├── src/main/java/com/brewbatch/
│   │   ├── config/                  # Security configuration
│   │   ├── controller/              # REST controllers
│   │   ├── dto/                     # Data transfer objects
│   │   ├── model/                   # JPA entities
│   │   ├── repository/              # Spring Data JPA repos
│   │   ├── security/                # JWT utils, filters, UserDetails
│   │   └── service/                 # Business logic
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── web/                             # React frontend
│   ├── src/
│   │   ├── components/              # Shared components (Navbar, PrivateRoute)
│   │   ├── context/                 # AuthContext (global state)
│   │   ├── pages/                   # LoginPage, RegisterPage, DashboardPage
│   │   └── services/                # api.js, authService.js
│   └── package.json
├── mobile/                          # Mobile app (future scope)
└── docs/                            # Documentation, ERD, screenshots
```

---

## ⚙️ Setup — Backend (Spring Boot)

### Prerequisites
- Java JDK 17+
- Maven 3.6+
- MySQL 8.x running locally

### Steps

**1. Create the database**
```sql
CREATE DATABASE brewbatch_db;
```

**2. Configure credentials**

Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/brewbatch_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=123456
```

**3. Run the backend**
```bash
cd backend
mvn spring-boot:run
```

The API will be available at: `http://localhost:8080`

> Hibernate will auto-create tables on first run (`spring.jpa.hibernate.ddl-auto=update`).

---

## ⚙️ Setup — Web (React)

### Prerequisites
- Node.js 18+ and npm

### Steps

**1. Install dependencies**
```bash
cd web
npm install
```

**2. Set API URL (optional)**

Create a `.env` file in the `/web` directory:
```env
REACT_APP_API_URL=http://localhost:8080
```
> If omitted, the app defaults to `http://localhost:8080` (or uses the proxy in `package.json`).

**3. Start the development server**
```bash
npm start
```

The app will open at: `http://localhost:3000`

---

## ⚙️ Setup — Mobile (Future Scope)

The `/mobile` folder is reserved for a React Native or Flutter mobile client. Setup instructions will be added in a future lab.

---

## 🔌 Connecting Frontend to Backend

The React app communicates with Spring Boot via Axios. Two configurations ensure this works:

**1. CORS (Backend — WebSecurityConfig.java)**
```java
config.setAllowedOrigins(List.of("http://localhost:3000"));
```
This allows the React dev server to make cross-origin requests to the Spring Boot API.

**2. Proxy (Frontend — package.json)**
```json
"proxy": "http://localhost:8080"
```
This lets you call `/api/auth/login` from React without specifying the full URL during development.

**3. JWT Flow**
```
User logs in → POST /api/auth/login
Backend returns JWT token
React stores token in localStorage
Every subsequent request: Authorization: Bearer <token>
Backend validates token via AuthTokenFilter
```

---

## 📡 API Endpoint Reference

| Method | Endpoint              | Auth Required | Description                        |
|--------|-----------------------|---------------|------------------------------------|
| POST   | `/api/auth/register`  | ❌ No          | Register a new user                |
| POST   | `/api/auth/login`     | ❌ No          | Login and receive JWT token        |
| GET    | `/api/user/me`        | ✅ Yes (JWT)   | Get authenticated user's profile   |

### Sample Requests

**Register**
```json
POST /api/auth/register
{
  "username": "barista01",
  "email": "barista@brewbatch.com",
  "password": "coffee123",
  "fullName": "Jane Doe"
}
```

**Login**
```json
POST /api/auth/login
{
  "username": "barista01",
  "password": "coffee123"
}
```
**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "id": 1,
  "username": "barista01",
  "email": "barista@brewbatch.com",
  "role": "ROLE_USER"
}
```

**Get Profile**
```
GET /api/user/me
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

---


---

## 📄 License

For academic use only — IT342, Academic Year 2024–2025.
