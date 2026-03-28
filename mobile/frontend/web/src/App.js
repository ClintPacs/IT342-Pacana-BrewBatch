import { useState, useEffect, createContext, useContext } from "react";

// ─── Theme ────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=Jost:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --espresso: #1A0800;
    --dark: #2E1503;
    --roast: #4A2008;
    --coffee: #6B3A1F;
    --mocha: #8B5E3C;
    --caramel: #C4874A;
    --latte: #D9B896;
    --cream: #F2E4D0;
    --milk: #FAF4EC;
    --red: #C0392B;
    --green: #27AE60;
    --red-bg: #FEF2F2;
    --red-border: #FECACA;
    --green-bg: #F0FDF4;
    --green-border: #BBF7D0;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Jost', sans-serif;
    background: var(--milk);
    color: var(--dark);
    min-height: 100vh;
  }

  /* ── Auth Pages ── */
  .auth-bg {
    min-height: 100vh;
    background: var(--milk);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  .auth-logo { text-align: center; margin-bottom: 20px; }
  .auth-icon { font-size: 44px; display: block; margin-bottom: 6px; }
  .auth-title {
    font-family: 'Lora', serif;
    font-size: 26px;
    font-weight: 700;
    color: var(--dark);
  }
  .auth-sub { font-size: 13px; color: var(--mocha); margin-top: 3px; }

  .auth-card {
    background: #fff;
    border-radius: 14px;
    padding: 24px;
    width: 100%;
    max-width: 340px;
    box-shadow: 0 4px 24px rgba(106,58,31,.12);
    border: 2px solid var(--caramel);
    outline: 4px solid rgba(196,135,74,.15);
  }

  .form-group { margin-bottom: 14px; }

  .form-label {
    display: block;
    font-size: 10px;
    font-weight: 600;
    color: var(--coffee);
    text-transform: uppercase;
    letter-spacing: 0.7px;
    margin-bottom: 5px;
  }

  .form-input {
    width: 100%;
    border: 1.5px solid var(--cream);
    border-radius: 8px;
    padding: 9px 12px;
    font-size: 13px;
    color: var(--dark);
    background: var(--milk);
    font-family: 'Jost', sans-serif;
    outline: none;
    transition: border-color .15s, background .15s;
    position: relative;
  }
  .form-input:focus {
    border-color: var(--coffee);
    background: #fff;
  }
  .form-input.error {
    border-color: var(--red);
    background: var(--red-bg);
  }
  .form-input.success {
    border-color: var(--green);
    background: var(--green-bg);
  }

  .input-wrap { position: relative; }
  .eye-btn {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: var(--mocha);
    font-size: 14px;
    padding: 2px;
  }

  .btn-primary {
    width: 100%;
    padding: 11px;
    background: var(--coffee);
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Jost', sans-serif;
    margin-top: 6px;
    transition: background .15s, opacity .15s;
  }
  .btn-primary:hover { background: var(--roast); }
  .btn-primary:disabled {
    background: #9CA3AF;
    cursor: not-allowed;
  }
  .btn-primary.loading { opacity: .7; }

  .btn-danger {
    padding: 6px 12px;
    background: #B91C1C;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Jost', sans-serif;
    transition: background .15s;
  }
  .btn-danger:hover { background: #991B1B; }

  .btn-outline {
    padding: 6px 12px;
    background: rgba(255,255,255,.12);
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    font-family: 'Jost', sans-serif;
    transition: background .15s;
  }
  .btn-outline:hover { background: rgba(255,255,255,.2); }

  .alert-error {
    background: var(--red-bg);
    border: 1px solid var(--red-border);
    border-radius: 7px;
    padding: 8px 12px;
    font-size: 12px;
    color: var(--red);
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .alert-success {
    background: var(--green-bg);
    border: 1px solid var(--green-border);
    border-radius: 7px;
    padding: 8px 12px;
    font-size: 12px;
    color: var(--green);
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .auth-link {
    text-align: center;
    margin-top: 14px;
    font-size: 12px;
    color: var(--coffee);
    cursor: pointer;
  }
  .auth-link u { cursor: pointer; }
  .auth-link u:hover { color: var(--roast); }

  .pwd-badge {
    background: var(--caramel);
    color: var(--dark);
    font-size: 9px;
    padding: 1px 7px;
    border-radius: 10px;
    font-weight: 700;
    margin-left: 5px;
  }

  /* Loading dots */
  .dots-wrap {
    display: flex;
    justify-content: center;
    gap: 5px;
    padding: 8px 0 4px;
  }
  .dot-pulse {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--latte);
    animation: pulse 1.2s infinite;
  }
  .dot-pulse:nth-child(2) { animation-delay: .2s; }
  .dot-pulse:nth-child(3) { animation-delay: .4s; }
  @keyframes pulse {
    0%,100% { opacity: .3; transform: scale(.8); }
    50% { opacity: 1; transform: scale(1.1); }
  }

  /* ── Dashboard Layout ── */
  .dash-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--milk);
  }

  .topnav {
    background: var(--roast);
    padding: 12px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 50;
    box-shadow: 0 2px 10px rgba(0,0,0,.2);
  }

  .topnav-logo {
    font-family: 'Lora', serif;
    font-size: 16px;
    color: #fff;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .topnav-actions { display: flex; gap: 8px; align-items: center; }

  .dash-body { display: flex; flex: 1; }

  .sidebar {
    width: 190px;
    flex-shrink: 0;
    background: var(--espresso);
    border-right: 1px solid rgba(180,100,40,.15);
    padding: 16px 0;
    min-height: calc(100vh - 48px);
  }

  .sidebar-section {
    padding: 6px 14px 3px;
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(180,100,40,.4);
    font-family: 'JetBrains Mono', monospace;
  }

  .sidebar-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    font-size: 13px;
    color: rgba(212,152,100,.5);
    cursor: pointer;
    border-left: 2px solid transparent;
    transition: all .15s;
  }
  .sidebar-item:hover {
    color: var(--caramel);
    background: rgba(180,100,40,.08);
  }
  .sidebar-item.active {
    color: var(--caramel);
    border-left-color: var(--caramel);
    background: rgba(180,100,40,.12);
  }

  .main-content { flex: 1; padding: 24px; overflow-x: auto; }

  .page-title {
    font-family: 'Lora', serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--dark);
    margin-bottom: 20px;
  }

  /* Stat cards */
  .stat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 20px;
  }

  .stat-card {
    background: #fff;
    border-radius: 10px;
    padding: 14px;
    box-shadow: 0 2px 10px rgba(106,58,31,.07);
  }

  .stat-label {
    font-size: 9px;
    color: var(--mocha);
    text-transform: uppercase;
    letter-spacing: .5px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .stat-value {
    font-size: 26px;
    font-weight: 700;
    color: var(--dark);
    font-family: 'Lora', serif;
  }

  /* Profile card */
  .profile-card {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(106,58,31,.08);
    max-width: 520px;
  }

  .profile-head {
    background: var(--cream);
    padding: 10px 16px;
    border-bottom: 1px solid var(--latte);
    font-size: 12px;
    font-weight: 600;
    color: var(--coffee);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .profile-row {
    display: flex;
    align-items: center;
    padding: 9px 16px;
    border-bottom: 1px solid #F5F0E8;
  }
  .profile-row:last-child { border-bottom: none; }

  .profile-key {
    width: 100px;
    font-size: 10px;
    color: var(--mocha);
    text-transform: uppercase;
    letter-spacing: .4px;
    font-weight: 500;
    flex-shrink: 0;
  }

  .profile-val {
    font-size: 13px;
    font-weight: 500;
    color: var(--dark);
  }

  .role-badge {
    background: var(--cream);
    color: var(--coffee);
    font-size: 10px;
    padding: 2px 8px;
    border-radius: 20px;
    font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
  }

  .welcome-text {
    font-family: 'Lora', serif;
    font-size: 15px;
    color: var(--dark);
    margin-bottom: 16px;
    font-weight: 600;
  }

  /* Responsive */
  @media (max-width: 640px) {
    .sidebar { display: none; }
    .stat-grid { grid-template-columns: repeat(2, 1fr); }
  }
`;

// ─── Auth Context ──────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

function useAuth() {
  return useContext(AuthContext);
}

// ─── API helpers ──────────────────────────────────────────────────────────────
const BASE = "http://localhost:8080";

async function apiPost(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error?.message || "Request failed");
  return data;
}

async function apiGet(path, token) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Unauthorized");
  return data;
}

// ─── Login Page ───────────────────────────────────────────────────────────────
function LoginPage({ onSwitch }) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username || !password) { setError("Please fill in all fields."); return; }
    setError(""); setLoading(true);
    try {
      const data = await apiPost("/api/auth/login", { username, password });
      const token = data.data?.token || data.token;
      const user = data.data?.user || data;
      login(token, user);
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-bg">
      <div className="auth-logo">
        <span className="auth-icon">☕</span>
        <div className="auth-title">BrewBatch</div>
        <div className="auth-sub">Manage your coffee shop</div>
      </div>
      <div className="auth-card">
        {error && (
          <div className="alert-error">⚠️ {error}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              className={`form-input ${error ? "error" : ""}`}
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrap">
              <input
                className={`form-input ${error ? "error" : ""}`}
                type={showPwd ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ paddingRight: 36 }}
                autoComplete="current-password"
              />
              <button type="button" className="eye-btn" onClick={() => setShowPwd(p => !p)}>
                {showPwd ? "🙈" : "👁"}
              </button>
            </div>
          </div>
          {loading && (
            <div className="dots-wrap">
              <div className="dot-pulse" /><div className="dot-pulse" /><div className="dot-pulse" />
            </div>
          )}
          <button className={`btn-primary ${loading ? "loading" : ""}`} type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
      <div className="auth-link">
        Don't have an account? <u onClick={onSwitch}>Register here</u>
      </div>
    </div>
  );
}

// ─── Register Page ────────────────────────────────────────────────────────────
function RegisterPage({ onSwitch }) {
  const [form, setForm] = useState({ fullName: "", username: "", email: "", password: "", confirm: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function set(k) { return e => setForm(f => ({ ...f, [k]: e.target.value })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.fullName || !form.username || !form.email || !form.password || !form.confirm) {
      setError("All fields are required."); return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Please enter a valid email address."); return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters."); return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match."); return;
    }

    setLoading(true);
    try {
      await apiPost("/api/auth/register", {
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        password: form.password,
        role: "BARISTA",
      });
      setSuccess(true);
      setTimeout(() => onSwitch(), 1800);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-bg">
      <div className="auth-logo">
        <span className="auth-icon" style={{ fontSize: 36 }}>☕</span>
        <div className="auth-title" style={{ fontSize: 22 }}>Create Account</div>
        <div className="auth-sub">Join the BrewBatch team</div>
      </div>
      <div className="auth-card">
        {error && <div className="alert-error">⚠️ {error}</div>}
        {success && <div className="alert-success">✅ Account created! Redirecting to login...</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className={`form-input ${success ? "success" : ""}`} type="text" placeholder="Jane Doe" value={form.fullName} onChange={set("fullName")} />
          </div>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input className={`form-input ${success ? "success" : ""}`} type="text" placeholder="barista01" value={form.username} onChange={set("username")} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className={`form-input ${success ? "success" : ""}`} type="email" placeholder="barista@brewbatch.com" value={form.email} onChange={set("email")} />
          </div>
          <div className="form-group">
            <label className="form-label">
              Password <span className="pwd-badge">≥8</span>
            </label>
            <div className="input-wrap">
              <input className={`form-input ${success ? "success" : ""}`} type={showPwd ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={set("password")} style={{ paddingRight: 36 }} />
              <button type="button" className="eye-btn" onClick={() => setShowPwd(p => !p)}>{showPwd ? "🙈" : "👁"}</button>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="input-wrap">
              <input className={`form-input ${success ? "success" : ""}`} type={showConfirm ? "text" : "password"} placeholder="••••••••" value={form.confirm} onChange={set("confirm")} style={{ paddingRight: 36 }} />
              <button type="button" className="eye-btn" onClick={() => setShowConfirm(p => !p)}>{showConfirm ? "🙈" : "👁"}</button>
            </div>
          </div>
          {loading && (
            <div className="dots-wrap">
              <div className="dot-pulse" /><div className="dot-pulse" /><div className="dot-pulse" />
            </div>
          )}
          <button className={`btn-primary ${success ? "" : ""} ${loading ? "loading" : ""}`} type="submit" disabled={loading || success}
            style={success ? { background: "var(--green)" } : {}}>
            {success ? "✅ Account Created!" : loading ? "Creating..." : "Create Account"}
          </button>
        </form>
      </div>
      <div className="auth-link">
        Already have an account? <u onClick={onSwitch}>Sign in</u>
      </div>
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
function DashboardPage() {
  const { user, token, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");

useEffect(() => {
    apiGet("/api/user/me", token)
      .then(data => setProfile(data.data || data))
      .catch(() => logout())
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const navItems = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "inventory", icon: "📦", label: "Inventory" },
    { id: "alerts", icon: "⚠️", label: "Alerts" },
    { id: "orders", icon: "📋", label: "Orders" },
    { id: "suppliers", icon: "🏪", label: "Suppliers" },
    { id: "admin", icon: "⚙️", label: "Admin" },
  ];

  return (
    <div className="dash-layout">
      {/* Top Nav */}
      <nav className="topnav">
        <div className="topnav-logo">☕ BrewBatch</div>
        <div className="topnav-actions">
          <button className="btn-outline" onClick={() => setLoading(true) || apiGet("/api/user/me", token).then(d => setProfile(d.data || d)).finally(() => setLoading(false))}>
            ↺ Refresh
          </button>
          <button className="btn-danger" onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="dash-body">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-section">Navigation</div>
          {navItems.map(item => (
            <div
              key={item.id}
              className={`sidebar-item ${activePage === item.id ? "active" : ""}`}
              onClick={() => setActivePage(item.id)}
            >
              {item.icon} {item.label}
            </div>
          ))}
        </aside>

        {/* Main */}
        <main className="main-content">
          {activePage === "dashboard" && (
            <>
              <div className="welcome-text">
                Welcome, {profile?.username || user?.username || "User"} ☕
              </div>

              {/* Stat Cards */}
              <div className="stat-grid">
                <div className="stat-card">
                  <div className="stat-label">Role</div>
                  <div className="stat-value" style={{ fontSize: 18, fontFamily: "'JetBrains Mono', monospace" }}>
                    {profile?.role || user?.role || "—"}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">User ID</div>
                  <div className="stat-value" style={{ fontSize: 22 }}>
                    #{profile?.id || user?.id || "—"}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Status</div>
                  <div className="stat-value" style={{ fontSize: 14, color: "var(--green)" }}>
                    ● Active
                  </div>
                </div>
              </div>

              {/* Profile Card */}
              {loading ? (
                <div className="dots-wrap"><div className="dot-pulse" /><div className="dot-pulse" /><div className="dot-pulse" /></div>
              ) : (
                <div className="profile-card">
                  <div className="profile-head">👤 Profile</div>
                  <div className="profile-row">
                    <div className="profile-key">Username</div>
                    <div className="profile-val">{profile?.username || "—"}</div>
                  </div>
                  <div className="profile-row">
                    <div className="profile-key">Full Name</div>
                    <div className="profile-val">{profile?.fullName || "—"}</div>
                  </div>
                  <div className="profile-row">
                    <div className="profile-key">Email</div>
                    <div className="profile-val">{profile?.email || "—"}</div>
                  </div>
                  <div className="profile-row">
                    <div className="profile-key">Role</div>
                    <div className="profile-val">
                      <span className="role-badge">{profile?.role || "—"}</span>
                    </div>
                  </div>
                  <div className="profile-row">
                    <div className="profile-key">ID</div>
                    <div className="profile-val">#{profile?.id || "—"}</div>
                  </div>
                </div>
              )}
            </>
          )}

          {activePage !== "dashboard" && (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--mocha)" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>
                {navItems.find(n => n.id === activePage)?.icon}
              </div>
              <div style={{ fontFamily: "'Lora', serif", fontSize: 18, color: "var(--dark)", marginBottom: 8 }}>
                {navItems.find(n => n.id === activePage)?.label}
              </div>
              <div style={{ fontSize: 13 }}>Coming in Phase 2</div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ─── Auth Provider ────────────────────────────────────────────────────────────
function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("bb_token"));
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("bb_user")); } catch { return null; }
  });

  function login(tok, usr) {
    localStorage.setItem("bb_token", tok);
    localStorage.setItem("bb_user", JSON.stringify(usr));
    setToken(tok);
    setUser(usr);
  }

  function logout() {
    localStorage.removeItem("bb_token");
    localStorage.removeItem("bb_user");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Router ───────────────────────────────────────────────────────────────────
function Router() {
  const { token } = useAuth();
  const [page, setPage] = useState("login");

  if (token) return <DashboardPage />;
  if (page === "login") return <LoginPage onSwitch={() => setPage("register")} />;
  return <RegisterPage onSwitch={() => setPage("login")} />;
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <style>{CSS}</style>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </>
  );
}
