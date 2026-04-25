// ============================================================
// Search Page
// Filter bar (text, specialty, location, sort) + results grid.
// Reads initial query/specialty from URL search params.
// ============================================================

const { useState: useSearchState, useEffect: useSearchEffect } = React;
const { useSearchParams } = ReactRouterDOM;

function Search() {
  const [searchParams] = useSearchParams();

  const [query,     setQuery]     = useSearchState(searchParams.get('q') || '');
  const [specialty, setSpecialty] = useSearchState('All Specialties');
  const [location,  setLocation]  = useSearchState('All Locations');
  const [sort,      setSort]      = useSearchState('rating');

  // Resolve specialty from URL (e.g. ?specialty=Cardiology from Home page)
  useSearchEffect(() => {
    const raw = searchParams.get('specialty');
    if (raw) {
      const mapped = window.SPECIALTY_MAP[raw] || raw;
      setSpecialty(window.SPECIALTY_OPTIONS.includes(mapped) ? mapped : 'All Specialties');
    }
  }, [searchParams]);

  const filtered = window.DOCTORS
    .filter((d) => {
      const matchQ = !query ||
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.specialty.toLowerCase().includes(query.toLowerCase());

      const matchS = specialty === 'All Specialties' || d.specialty === specialty;

      const matchL = location === 'All Locations' ||
        d.location === location ||
        (location === 'Cairo'       && d.location.endsWith(', Cairo')) ||
        (location === 'Alexandria'  && d.location.endsWith(', Alexandria'));

      return matchQ && matchS && matchL;
    })
    .sort((a, b) => {
      if (sort === 'rating')     return b.rating - a.rating;
      if (sort === 'fee-low')    return a.fee - b.fee;
      if (sort === 'fee-high')   return b.fee - a.fee;
      if (sort === 'experience') return b.experience - a.experience;
      return 0;
    });

  const clearFilters = () => {
    setQuery('');
    setSpecialty('All Specialties');
    setLocation('All Locations');
    setSort('rating');
  };

  return (
    <div className="fade-in min-h-screen bg-bgLight">

      {/* Page header */}
      <div className="bg-white border-b border-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-sora font-bold text-2xl sm:text-3xl text-textDark mb-1">Find a Doctor</h1>
          <p className="text-textMuted text-sm">
            {filtered.length} doctor{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Filter bar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-8" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

            {/* Text search */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted pointer-events-none"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Name or specialty…"
                className="input-field"
                style={{ paddingLeft: '2.25rem' }}
              />
            </div>

            {/* Specialty */}
            <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="input-field">
              {window.SPECIALTY_OPTIONS.map((s) => <option key={s}>{s}</option>)}
            </select>

            {/* Location */}
            <select value={location} onChange={(e) => setLocation(e.target.value)} className="input-field">
              {window.LOCATION_OPTIONS.map((l) => <option key={l}>{l}</option>)}
            </select>

            {/* Sort */}
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-field">
              <option value="rating">Sort: Top Rated</option>
              <option value="fee-low">Sort: Fee (Low → High)</option>
              <option value="fee-high">Sort: Fee (High → Low)</option>
              <option value="experience">Sort: Most Experienced</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((doc) => (
              <DoctorCard key={doc.id} doctor={doc} />
            ))}
          </div>
        ) : (
          <div className="text-center py-28">
            <div style={{ fontSize: '3.5rem', marginBottom: '1.25rem' }}>🔍</div>
            <h3 className="font-sora font-bold text-xl text-textDark mb-2">No doctors found</h3>
            <p className="text-textMuted mb-8 text-sm">Try adjusting your search filters</p>
            <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
