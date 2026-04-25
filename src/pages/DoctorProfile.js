// ============================================================
// DoctorProfile Page
// Shows full doctor details, availability days, and a
// time-slot booking flow with confirmation feedback.
// ============================================================

const { useState: useProfileState } = React;
const { useParams, useNavigate: useProfileNavigate } = ReactRouterDOM;

const ALL_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function ProfileStars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} className={`w-4 h-4 ${n <= Math.round(rating) ? 'star' : 'star-empty'}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function DoctorProfile() {
  const { id }    = useParams();
  const navigate  = useProfileNavigate();
  const doctor    = window.DOCTORS.find((d) => d.id === Number(id));

  const [showSlots, setShowSlots] = useProfileState(false);
  const [selected,  setSelected]  = useProfileState(null);
  const [confirmed, setConfirmed] = useProfileState(false);

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bgLight">
        <div className="text-center">
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>😕</div>
          <h2 className="font-sora font-bold text-2xl text-textDark mb-2">Doctor not found</h2>
          <p className="text-textMuted mb-6 text-sm">The profile you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/search')} className="btn-primary">Back to Search</button>
        </div>
      </div>
    );
  }

  const handleConfirm = () => {
    if (!selected) return;
    setConfirmed(true);
    setShowSlots(false);
  };

  return (
    <div className="fade-in min-h-screen bg-bgLight">

      {/* Success banner */}
      {confirmed && (
        <div className="text-white py-4 px-4 text-center font-medium" style={{ background: '#10B981' }}>
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Appointment confirmed with {doctor.name} at {selected}!
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-textMuted hover:text-primary transition-colors mb-8 text-sm font-medium"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Search
        </button>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Left column ────────────────────────────────── */}
          <div className="flex-1 space-y-5">

            {/* Profile card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div className="flex flex-col sm:flex-row gap-6">

                {/* Avatar */}
                <div className="relative self-center sm:self-start flex-shrink-0">
                  <img
                    src={doctor.image} alt={doctor.name}
                    className="w-28 h-28 rounded-2xl object-cover border-2 border-gray-100"
                  />
                  {doctor.verified && (
                    <div className="absolute -bottom-2 -right-2 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1"
                      style={{ background: '#10B981' }}>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h1 className="font-sora font-bold text-2xl text-textDark">{doctor.name}</h1>
                  <p className="text-primary font-semibold text-lg">{doctor.specialty}</p>

                  <div className="flex items-center gap-2 mt-2">
                    <ProfileStars rating={doctor.rating} />
                    <span className="font-bold text-textDark text-sm">{doctor.rating}</span>
                    <span className="text-textMuted text-sm">({doctor.reviews} reviews)</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="bg-lightBlue text-primary text-xs font-semibold px-3 py-1.5 rounded-full">
                      {doctor.experience} yrs experience
                    </span>
                    {doctor.languages.map((lang) => (
                      <span key={lang} className="bg-gray-100 text-textMuted text-xs font-medium px-3 py-1.5 rounded-full">
                        {lang}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 mt-4 text-sm text-textMuted">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {doctor.location}
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <h2 className="font-sora font-bold text-xl text-textDark mb-4">About</h2>
              <p className="text-textMuted leading-relaxed text-sm">{doctor.about}</p>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <h2 className="font-sora font-bold text-xl text-textDark mb-4">Available Days</h2>
              <div className="flex flex-wrap gap-2">
                {ALL_DAYS.map((day) => {
                  const available = doctor.availability.includes(day);
                  return (
                    <div key={day}
                      className="px-4 py-2 rounded-xl text-sm font-semibold select-none"
                      style={{
                        background: available ? '#1A65D6' : '#f1f5f9',
                        color:      available ? '#fff'    : '#94a3b8',
                      }}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Right column (sticky booking card) ─────────── */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:sticky"
              style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)', top: '5.5rem' }}>

              {/* Fee */}
              <div className="text-center border-b border-gray-100 pb-6 mb-6">
                <p className="text-textMuted text-xs uppercase tracking-widest mb-1">Consultation Fee</p>
                <p className="font-sora font-bold text-4xl text-textDark">EGP {doctor.fee}</p>
                <p className="text-textMuted text-xs mt-1">per visit</p>
              </div>

              {/* Next slot */}
              <div className="flex items-center gap-3 rounded-xl px-4 py-3 mb-6"
                style={{ background: '#f0fdf4', border: '1px solid #d1fae5', color: '#10B981' }}>
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-xs font-medium" style={{ color: '#16a34a' }}>Next Available</p>
                  <p className="font-semibold text-sm">{doctor.nextSlot}</p>
                </div>
              </div>

              {/* Book / confirmed */}
              {confirmed ? (
                <div className="w-full text-white text-center font-semibold py-3 rounded-full mb-3 text-sm"
                  style={{ background: '#10B981' }}>
                  ✓ Appointment Booked!
                </div>
              ) : (
                <button
                  onClick={() => setShowSlots(!showSlots)}
                  className="btn-primary w-full mb-3"
                >
                  {showSlots ? 'Hide Time Slots' : 'Book Appointment'}
                </button>
              )}

              <button className="btn-outline w-full text-sm">Teleconsultation</button>

              {/* Time slot picker */}
              {showSlots && !confirmed && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="font-sora font-semibold text-textDark text-sm mb-4">Select a Time Slot</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {doctor.timeSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelected(slot)}
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.6rem 0.5rem',
                          borderRadius: '0.75rem',
                          border: selected === slot ? '2px solid #1A65D6' : '1.5px solid #e2e8f0',
                          background: selected === slot ? '#1A65D6' : '#fff',
                          color: selected === slot ? '#fff' : '#64748b',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>

                  {selected && (
                    <button
                      onClick={handleConfirm}
                      className="w-full mt-4 text-white font-bold py-3 rounded-full text-sm"
                      style={{ background: '#10B981', border: 'none', cursor: 'pointer' }}
                    >
                      Confirm Booking
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
