# ✅ BrewBatch — Task Checklist
> **IT342 Laboratory 1 | Group 5**
> **Project:** BrewBatch - Inventory & Order Management for Coffee Shops
> Last Updated: March 04, 2026

---

## ✅ DONE

| # | Task | Description | Commit Hash | Completed By |
|---|------|-------------|-------------|--------------|
| 1 | Project Structure | Created root folder `IT342_G5_Lastname_Lab1` with `/web`, `/backend`, `/mobile`, `/docs` subfolders | `a1b2c3d` | [Name] |
| 2 | Backend Initialization | Set up Spring Boot 3.x Maven project with required dependencies | `b2c3d4e` | [Name] |
| 3 | Database Setup | Created `brewbatch_db` MySQL database and configured `application.properties` | `c3d4e5f` | [Name] |
| 4 | User Entity | Implemented `User.java` JPA entity with id, username, email, password, fullName, role, createdAt fields | `d4e5f6g` | [Name] |
| 5 | User Repository | Created `UserRepository` with `findByUsername`, `existsByUsername`, `existsByEmail` methods | `e5f6g7h` | [Name] |
| 6 | DTOs | Created `RegisterRequest`, `LoginRequest`, `JwtResponse`, `MessageResponse` data transfer objects | `f6g7h8i` | [Name] |
| 7 | BCrypt Password Encryption | Configured `BCryptPasswordEncoder` bean in `WebSecurityConfig` | `g7h8i9j` | [Name] |
| 8 | JWT Utilities | Implemented `JwtUtils` for HS256 token generation and validation | `h8i9j0k` | [Name] |
| 9 | UserDetailsImpl | Created Spring Security `UserDetails` implementation wrapping the `User` entity | `i9j0k1l` | [Name] |
| 10 | UserDetailsServiceImpl | Implemented `loadUserByUsername` to load users from the database | `j0k1l2m` | [Name] |
| 11 | Auth Token Filter | Created `AuthTokenFilter` to intercept requests and validate JWT from `Authorization` header | `k1l2m3n` | [Name] |
| 12 | Auth Entry Point | Implemented `AuthEntryPointJwt` to return clean 401 JSON on unauthorized access | `l2m3n4o` | [Name] |
| 13 | Security Configuration | Configured `WebSecurityConfig` with CORS, stateless sessions, and open/protected route rules | `m3n4o5p` | [Name] |
| 14 | Auth Service | Implemented `register()` with BCrypt and `login()` with JWT generation in `AuthService` | `n4o5p6q` | [Name] |
| 15 | Register Endpoint | Implemented `POST /api/auth/register` in `AuthController` | `o5p6q7r` | [Name] |
| 16 | Login Endpoint | Implemented `POST /api/auth/login` in `AuthController` returning JWT token | `p6q7r8s` | [Name] |
| 17 | Protected User Endpoint | Implemented `GET /api/user/me` in `UserController` requiring valid JWT | `q7r8s9t` | [Name] |
| 18 | React Initialization | Bootstrapped React 18 app with `create-react-app` including `public/index.html` | `r8s9t0u` | [Name] |
| 19 | Axios API Setup | Configured `api.js` with base URL, JWT request interceptor, and 401 response interceptor | `s9t0u1v` | [Name] |
| 20 | Auth Service (Frontend) | Created `authService.js` with `login()`, `register()`, `logout()`, `getCurrentUser()` functions | `t0u1v2w` | [Name] |
| 21 | Auth Context | Implemented `AuthContext.js` for global authentication state using React Context API | `u1v2w3x` | [Name] |
| 22 | Private Route | Built `PrivateRoute.js` component that redirects unauthenticated users to `/login` | `v2w3x4y` | [Name] |
| 23 | Login Page | Built and styled `LoginPage.js` with form, error handling, and post-login redirect | `w3x4y5z` | [Name] |
| 24 | Register Page | Built and styled `RegisterPage.js` with full form and password confirmation validation | `x4y5z6a` | [Name] |
| 25 | Dashboard Page | Built `DashboardPage.js` with sidebar, stats cards, and live profile from `GET /api/user/me` | `y5z6a7b` | [Name] |
| 26 | App Routing | Configured `App.js` with React Router v6 public and protected routes | `z6a7b8c` | [Name] |
| 27 | CORS Configuration | Enabled CORS in Spring Boot to allow requests from `http://localhost:3000` | `a7b8c9d` | [Name] |
| 28 | Proxy Configuration | Added `"proxy": "http://localhost:8080"` in `web/package.json` | `b8c9d0e` | [Name] |
| 29 | README.md | Created comprehensive README with project description, tech stack, setup steps, and API docs | `c9d0e1f` | [Name] |
| 30 | Task Checklist | Created `TASK_CHECKLIST.md` with DONE, IN-PROGRESS, and TODO categories | `d0e1f2g` | [Name] |

---

## 🔄 IN-PROGRESS

| # | Task | Description | Assigned To | Target Date |
|---|------|-------------|-------------|-------------|
| 1 | Screenshots & PDF | Take screenshots of Login, Register, Dashboard pages and compile into a PDF in `/docs` | [Name] | [Date] |
| 2 | ERD Diagram | Create Entity-Relationship Diagram for the `users` table using Lucidchart or Draw.io | [Name] | [Date] |
| 3 | Inventory Module | Design and implement `InventoryItem` entity, service, and CRUD controller | [Name] | [Date] |
| 4 | Orders Module | Create `Order` and `OrderItem` entities with full CRUD API endpoints | [Name] | [Date] |

---

## 📋 TODO

| # | Task | Description | Priority | Assigned To |
|---|------|-------------|----------|-------------|
| 1 | Role-Based Access Control | Add `ROLE_ADMIN` and `ROLE_STAFF` with different endpoint permissions | High | — |
| 2 | Inventory CRUD UI | Build React pages for listing, adding, editing, and deleting inventory items | High | — |
| 3 | Order Management UI | Build React pages to create, view, and update orders | High | — |
| 4 | Input Validation UI | Add real-time validation feedback and field error messages on all forms | Medium | — |
| 5 | Global Error Handler | Add `@ControllerAdvice` in Spring Boot for centralized exception handling | Medium | — |
| 6 | Unit Tests | Write JUnit tests for `AuthService` and integration tests for auth endpoints | Medium | — |
| 7 | Mobile App | Initialize React Native or Flutter mobile client in the `/mobile` folder | Medium | — |
| 8 | Refresh Tokens | Implement JWT refresh token flow to extend user sessions securely | Low | — |
| 9 | Swagger / OpenAPI | Integrate Springdoc OpenAPI for auto-generated interactive API documentation | Low | — |
| 10 | Dockerize | Add `Dockerfile` and `docker-compose.yml` for easy one-command deployment | Low | — |
| 11 | Deploy | Deploy backend to Railway/Render and frontend to Vercel | Low | — |

---

## 📎 Notes

- Commit hashes above are sample 7-character SHA identifiers (e.g. from `git log --oneline`)
- Replace `[Name]` with the actual group member who completed each task
- Replace `[Date]` with the actual target completion date
- Move items between sections as their status changes
- Screenshots and diagrams should be saved as a PDF inside the `/docs` folder

---

