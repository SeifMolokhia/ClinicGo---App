// ============================================================
// Home Page
// Sections: Hero, Stats, Browse by Specialty, Top Doctors,
//           How It Works, CTA Banner
// ============================================================

const { useState: useHomeState, useEffect: useHomeEffect } = React;
const { Link: HomeLink, useNavigate: useHomeNavigate } = ReactRouterDOM;

const HOME_SPECIALTIES = [
  { name: 'Cardiology',    icon: '🫀' },
  { name: 'Dermatology',   icon: '🧴' },
  { name: 'Pediatrics',    icon: '👶' },
  { name: 'Orthopedics',   icon: '🦴' },
  { name: 'Neurology',     icon: '🧠' },
  { name: 'Gynecology',    icon: '🌸' },
  { name: 'ENT',           icon: '👂' },
  { name: 'Ophthalmology', icon: '👁️' },
];

const STATS = [
  { value: '500+', label: 'Doctors' },
  { value: '50K+', label: 'Patients' },
  { value: '20+',  label: 'Specialties' },
  { value: '4.8★', label: 'Avg Rating' },
];

const STEPS = [
  { step: '01', icon: '🔍', title: 'Search',  desc: 'Find doctors by specialty, location, or name' },
  { step: '02', icon: '✅', title: 'Choose',  desc: 'Compare profiles, read reviews, and pick the best specialist' },
  { step: '03', icon: '📅', title: 'Book',    desc: 'Select a time slot and confirm instantly' },
];

function Home() {
  const [query, setQuery] = useHomeState('');
  const [topDoctors, setTopDoctors] = useHomeState([]);
  const [loadError, setLoadError] = useHomeState('');
  const navigate = useHomeNavigate();

  // Fetch top 6 doctors (sorted by rating) from the backend
  useHomeEffect(() => {
    let cancelled = false;
    window.api.get('/doctors?sort=rating&limit=6')
      .then((data) => { if (!cancelled) setTopDoctors(data.doctors || []); })
      .catch((err) => { if (!cancelled) setLoadError(err.message); });
    return () => { cancelled = true; };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/search' + (query ? '?q=' + encodeURIComponent(query) : ''));
  };

  return (
    <div className="fade-in">

      {/* ── Hero ──────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-24 px-4"
        style={{ background: 'linear-gradient(135deg, #041740 0%, #1A65D6 100%)' }}
      >
        <div className="relative max-w-4xl mx-auto text-center">
          {/* badge */}
          <div className="inline-flex items-center gap-2 border border-white/20 text-white rounded-full px-4 py-2 text-sm font-medium mb-8" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <span className="pulse-dot" />
            Egypt's #1 Doctor Booking Platform
          </div>

          <h1 className="font-sora font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white mb-6 leading-tight">
            Find &amp; Book Trusted<br />
            <span style={{ color: '#93c5fd' }}>Doctors Near You</span>
          </h1>

          <p className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: '#bfdbfe' }}>
            Search across 500+ verified doctors in Cairo, Alexandria &amp; beyond.
            Book in under 3 minutes.
          </p>

          {/* search bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-2 bg-white rounded-2xl p-2" style={{ boxShadow: '0 20px 60px -10px rgba(4,23,64,0.4)' }}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by doctor name or specialty…"
                className="flex-1 px-4 py-2.5 text-textDark placeholder-gray-400 bg-transparent outline-none font-medium min-w-0"
              />
              <button type="submit" className="btn-primary whitespace-nowrap text-sm">
                Search Doctors
              </button>
            </div>
          </form>

          <p className="mt-5 text-sm" style={{ color: 'rgba(191,219,254,0.8)' }}>
            Popular: <span style={{ color: 'rgba(255,255,255,0.9)' }}>Cardiologist · Dermatologist · Pediatrician · Neurologist</span>
          </p>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────── */}
      <section className="bg-navy py-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="font-sora font-bold text-3xl" style={{ color: '#93c5fd' }}>{s.value}</div>
                <div className="text-sm mt-1" style={{ color: 'rgba(191,219,254,0.6)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Browse by Specialty ───────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-sora font-bold text-3xl text-textDark mb-3">Browse by Specialty</h2>
            <p className="text-textMuted">Find the right specialist for your needs</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {HOME_SPECIALTIES.map((s) => (
              <HomeLink
                key={s.name}
                to={'/search?specialty=' + encodeURIComponent(s.name)}
                className="card p-6 text-center"
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{s.icon}</div>
                <div className="font-sora font-semibold text-textDark text-sm">{s.name}</div>
              </HomeLink>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top-Rated Doctors ─────────────────────────────── */}
      <section className="py-20 px-4 bg-bgLight">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-sora font-bold text-3xl text-textDark mb-2">Top-Rated Doctors</h2>
              <p className="text-textMuted">Trusted by thousands of patients across Egypt</p>
            </div>
            <HomeLink to="/search" className="btn-outline text-sm hidden md:block">View All →</HomeLink>
          </div>

          {loadError ? (
            <div className="text-center py-12 text-textMuted">
              <p className="mb-2">⚠️ {loadError}</p>
              <p className="text-xs">Make sure the backend is running on port 4000.</p>
            </div>
          ) : topDoctors.length === 0 ? (
            <div className="text-center py-12 text-textMuted">Loading doctors…</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {topDoctors.map((doc) => (
                <DoctorCard key={doc._id} doctor={doc} />
              ))}
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <HomeLink to="/search" className="btn-outline">View All Doctors</HomeLink>
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-sora font-bold text-3xl text-textDark mb-3">How It Works</h2>
            <p className="text-textMuted">Booking your appointment is simple and fast</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {STEPS.map((step) => (
              <div key={step.step} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-lightBlue mb-5" style={{ fontSize: '1.75rem' }}>
                  {step.icon}
                </div>
                <div className="font-sora font-bold text-primary text-xs tracking-widest uppercase mb-2">Step {step.step}</div>
                <h3 className="font-sora font-bold text-xl text-textDark mb-2">{step.title}</h3>
                <p className="text-textMuted text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────── */}
      <section
        className="py-24 px-4"
        style={{ background: 'linear-gradient(135deg, #041740 0%, #1A65D6 100%)' }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-sora font-bold text-3xl sm:text-4xl text-white mb-4">
            Ready to see a doctor?
          </h2>
          <p className="mb-10 text-lg" style={{ color: '#bfdbfe' }}>
            Join 50,000+ Egyptians who book their appointments on ClinicGo
          </p>
          <HomeLink
            to="/register"
            className="inline-block bg-white text-primary font-bold px-10 py-4 rounded-full transition-all duration-200"
            style={{ boxShadow: '0 8px 32px -4px rgba(4,23,64,0.4)' }}
          >
            Create Free Account
          </HomeLink>
        </div>
      </section>
    </div>
  );
}
