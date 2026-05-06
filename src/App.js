// ============================================================
// App.jsx — Root component
// Sets up HashRouter (works without a server config),
// declares all routes, and mounts the app to #root.
//
// HashRouter uses URL hash (#) for routing so the app works
// when served via python3 -m http.server without any rewrite
// rules (e.g. http://localhost:8000/#/search).
// ============================================================

const { HashRouter, Routes, Route } = ReactRouterDOM;

function App() {
  return (
    <HashRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />

        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/"             element={<Home />} />
            <Route path="/search"       element={<Search />} />
            <Route path="/doctor/:id"   element={<DoctorProfile />} />
            <Route path="/login"        element={<Login />} />
            <Route path="/register"     element={<Register />} />
            <Route path="/appointments" element={<MyAppointments />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </HashRouter>
  );
}

// Mount to DOM
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
