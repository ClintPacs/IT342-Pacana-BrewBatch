# ✅ BrewBatch — Task Checklist
> IT342 Laboratory 1 | Group 5
> Last Updated: [DATE]

---

## ✅ DONE

| Task | Description | Commit Hash | Completed By |
|------|-------------|-------------|--------------|
| Backend Init | Set up Spring Boot project with Maven | `a1b2c3d` | [Name] |
| Database Config | Created `brewbatch_db` MySQL database and configured `application.properties` | `e4f5g6h` | [Name] |
| User Entity | Implemented `User.java` JPA entity with validation constraints | `i7j8k9l` | [Name] |
| User Repository | Created `UserRepository` with custom finder methods | `m1n2o3p` | [Name] |
| BCrypt Password | Configured `BCryptPasswordEncoder` bean in security config | `q4r5s6t` | [Name] |
| JWT Utils | Implemented `JwtUtils` for token generation and validation | `u7v8w9x` | [Name] |
| Auth Filter | Created `AuthTokenFilter` to intercept and validate JWT per request | `y1z2a3b` | [Name] |
| Security Config | Configured `WebSecurityConfig` with CORS, stateless sessions, and open/protected routes | `c4d5e6f` | [Name] |
| Auth Controller | Implemented `POST /api/auth/register` and `POST /api/auth/login` | `g7h8i9j` | [Name] |
| User Controller | Implemented protected `GET /api/user/me` endpoint | `k1l2m3n` | [Name] |
| React Init | Bootstrapped React app with `create-react-app` | `o4p5q6r` | [Name] |
| Axios Setup | Configured `api.js` with base URL and JWT interceptors | `s7t8u9v` | [Name] |
| Auth Context | Created `AuthContext` with login, register, logout, and loading state | `w1x2y3z` | [Name] |
| Private Route | Implemented `PrivateRoute` component for route guarding | `a4b5c6d` | [Name] |
| Login Page | Built and styled `LoginPage` component | `e7f8g9h` | [Name] |
| Register Page | Built and styled `RegisterPage` component | `i1j2k3l` | [Name] |
| Dashboard Page | Built `DashboardPage` with profile card and stats overview | `m4n5o6p` | [Name] |
| App Routing | Configured `App.js` with public/protected routes using React Router v6 | `q7r8s9t` | [Name] |

---

## 🔄 IN-PROGRESS

| Task | Description | Assigned To | Target Date |
|------|-------------|-------------|-------------|
| Inventory Module | Design and implement `InventoryItem` entity, service, and controller | [Name] | [Date] |
| Orders Module | Create `Order` and `OrderItem` entities with full CRUD API | [Name] | [Date] |
| Dashboard Charts | Add Chart.js graphs to the Dashboard for sales/inventory trends | [Name] | [Date] |
| Form Validation | Add real-time input validation feedback on Register and Login pages | [Name] | [Date] |

---

## 📋 TODO

| Task | Description | Priority | Assigned To |
|------|-------------|----------|-------------|
| Role-Based Access | Add `ROLE_ADMIN` and `ROLE_STAFF` with different permissions | High | — |
| Inventory CRUD UI | Build frontend pages for listing, adding, editing, and deleting inventory | High | — |
| Order Management UI | Build frontend pages to create, view, and update orders | High | — |
| Mobile App | Initialize React Native / Flutter mobile client in `/mobile` | Medium | — |
| Error Handling | Add global error boundary in React and centralized exception handler in Spring Boot | Medium | — |
| Unit Tests | Write JUnit tests for `AuthService` and integration tests for auth endpoints | Medium | — |
| Dockerize | Add `Dockerfile` and `docker-compose.yml` for easy deployment | Low | — |
| Deploy | Deploy backend to Railway/Render and frontend to Vercel | Low | — |
| API Documentation | Integrate Swagger/OpenAPI for auto-generated API docs | Low | — |
| Refresh Tokens | Implement JWT refresh token flow to extend sessions securely | Low | — |

---

## 📎 Notes

- Commit hashes are short 7-character SHA identifiers from `git log --oneline`
- Update this checklist after every work session
- Move items between sections as their status changes
