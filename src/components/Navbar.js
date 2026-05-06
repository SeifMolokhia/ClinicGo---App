// ============================================================
// Navbar Component
// Sticky top navigation with logo, links, and mobile menu.
// Reads auth state from window.api and listens for the
// "auth-changed" event so login/logout updates the UI live.
// ============================================================

const { useState, useEffect } = React;
const { Link, NavLink, useNavigate } = ReactRouterDOM;

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user,     setUser]     = useState(window.api ? window.api.getUser() : null);
  const navigate = useNavigate();

  const close = () => setMenuOpen(false);

  // Re-render when login/logout happens
  useEffect(() => {
    const update = () => setUser(window.api.getUser());
    window.addEventListener('auth-changed', update);
    return () => window.removeEventListener('auth-changed', update);
  }, []);

  const handleLogout = () => {
    window.api.logout();
    close();
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    'font-medium transition-colors ' +
    (isActive ? 'text-primary' : 'text-textMuted hover:text-primary');

  const mobileNavLinkClass = ({ isActive }) =>
    'block px-3 py-2.5 rounded-xl font-medium transition-colors ' +
    (isActive ? 'bg-lightBlue text-primary' : 'text-textMuted hover:bg-gray-50');

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-decoration-none">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="font-sora font-bold text-xl text-navy">
              Clinic<span className="text-primary">Go</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/"            end className={navLinkClass}>Home</NavLink>
            <NavLink to="/search"          className={navLinkClass}>Find Doctors</NavLink>
            {user && <NavLink to="/appointments" className={navLinkClass}>My Appointments</NavLink>}
          </div>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm font-medium text-textDark">
                  Hi, {user.name.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-textMuted text-sm font-medium hover:text-primary transition-colors"
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login"    className="text-textMuted text-sm font-medium hover:text-primary transition-colors">Sign in</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-5">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-textMuted hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-5 pt-3 space-y-1">
          <NavLink to="/"       end className={mobileNavLinkClass} onClick={close}>Home</NavLink>
          <NavLink to="/search"     className={mobileNavLinkClass} onClick={close}>Find Doctors</NavLink>
          {user && <NavLink to="/appointments" className={mobileNavLinkClass} onClick={close}>My Appointments</NavLink>}
          <div className="pt-3 mt-2 border-t border-gray-100 flex flex-col gap-2">
            {user ? (
              <>
                <p className="text-center text-xs text-textMuted">Signed in as <strong>{user.email}</strong></p>
                <button
                  onClick={handleLogout}
                  className="btn-outline text-sm text-center"
                  style={{ width: '100%' }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login"    onClick={close} className="text-center py-2.5 text-textMuted font-medium hover:text-primary text-sm">Sign in</Link>
                <Link to="/register" onClick={close} className="btn-primary text-sm text-center">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
