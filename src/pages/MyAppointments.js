// ============================================================
// MyAppointments Page
// Lists the current user's bookings and lets them cancel.
// Requires authentication — redirects to /login otherwise.
// ============================================================

const { useState: useApptState, useEffect: useApptEffect } = React;
const { Link: ApptLink, useNavigate: useApptNavigate } = ReactRouterDOM;

function MyAppointments() {
  const navigate = useApptNavigate();
  const [appointments, setAppointments] = useApptState([]);
  const [loading,      setLoading]      = useApptState(true);
  const [error,        setError]        = useApptState('');

  // Redirect to login if not authenticated
  useApptEffect(() => {
    if (!window.api.isLoggedIn()) {
      navigate('/login');
    }
  }, []);

  const load = () => {
    setLoading(true);
    window.api.get('/appointments')
      .then((data) => setAppointments(data.appointments || []))
      .catch((err) => setError(err.message))
      .finally(()  => setLoading(false));
  };

  useApptEffect(load, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this appointment?')) return;
    try {
      await window.api.delete('/appointments/' + id);
      load(); // refresh list
    } catch (err) {
      alert('Failed to cancel: ' + err.message);
    }
  };

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
      });
    } catch { return iso; }
  };

  const statusBadge = (status) => {
    const colors = {
      booked:    { bg: '#dbeafe', text: '#1e40af' },
      cancelled: { bg: '#fee2e2', text: '#b91c1c' },
      completed: { bg: '#d1fae5', text: '#047857' },
    };
    const c = colors[status] || colors.booked;
    return (
      <span style={{
        display: 'inline-block', padding: '0.25rem 0.625rem', borderRadius: '9999px',
        fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase',
        letterSpacing: '0.05em', background: c.bg, color: c.text,
      }}>
        {status}
      </span>
    );
  };

  return (
    <div className="fade-in min-h-screen bg-bgLight">
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-sora font-bold text-3xl text-textDark mb-1">My Appointments</h1>
          <p className="text-textMuted text-sm">
            {loading ? 'Loading…' : `${appointments.length} appointment${appointments.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {error && (
          <div className="rounded-xl px-4 py-3 mb-6 text-sm font-medium"
            style={{ background: '#fee2e2', border: '1px solid #fecaca', color: '#b91c1c' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-textMuted">Loading appointments…</div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100"
            style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
            <h3 className="font-sora font-bold text-xl text-textDark mb-2">No appointments yet</h3>
            <p className="text-textMuted text-sm mb-6">Book your first appointment with one of our doctors.</p>
            <ApptLink to="/search" className="btn-primary">Find a Doctor</ApptLink>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt) => (
              <div key={apt._id}
                className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4"
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
              >
                {apt.doctor && apt.doctor.image && (
                  <img
                    src={apt.doctor.image}
                    alt={apt.doctor.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-sora font-semibold text-textDark truncate">
                      {apt.doctor ? apt.doctor.name : 'Doctor'}
                    </h3>
                    {statusBadge(apt.status)}
                  </div>
                  {apt.doctor && (
                    <p className="text-primary text-sm font-medium">{apt.doctor.specialty}</p>
                  )}
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-textMuted items-center">
                    <span>📅 {formatDate(apt.date)}</span>
                    <span>🕒 {apt.timeSlot}</span>
                    {apt.mode === 'teleconsultation' ? (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                        padding: '0.15rem 0.5rem', borderRadius: '9999px',
                        background: '#EEF5FF', color: '#1A65D6', fontWeight: 600,
                      }}>
                        💻 Teleconsultation
                      </span>
                    ) : (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                        padding: '0.15rem 0.5rem', borderRadius: '9999px',
                        background: '#f1f5f9', color: '#475569', fontWeight: 600,
                      }}>
                        🏥 In-person
                      </span>
                    )}
                    {apt.doctor && <span>📍 {apt.doctor.location}</span>}
                    {apt.doctor && <span>EGP {apt.doctor.fee}</span>}
                  </div>
                </div>
                {apt.status === 'booked' && (
                  <button
                    onClick={() => handleCancel(apt._id)}
                    className="text-red-600 hover:bg-red-50 text-sm font-semibold px-4 py-2 rounded-full transition-colors flex-shrink-0"
                    style={{ border: '1.5px solid #fca5a5', background: 'transparent', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
