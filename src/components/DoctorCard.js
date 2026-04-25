// ============================================================
// DoctorCard Component
// Reusable card displaying a doctor's summary info.
// Rendered in the Home (top-rated) and Search (results) pages.
// Props: { doctor }
// ============================================================

const { Link: CardLink } = ReactRouterDOM;

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          className={`w-3.5 h-3.5 ${n <= Math.round(rating) ? 'star' : 'star-empty'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function DoctorCard({ doctor }) {
  return (
    <CardLink to={`/doctor/${doctor.id}`} className="card p-5">

      {/* Header: avatar + core info */}
      <div className="flex items-start gap-4">
        <div className="relative flex-shrink-0">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
          />
          {doctor.verified && (
            <div
              className="absolute -bottom-1 -right-1 bg-success text-white rounded-full flex items-center justify-center"
              style={{ width: 20, height: 20 }}
              title="Verified"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-sora font-semibold text-textDark truncate" style={{ fontSize: '0.95rem' }}>
            {doctor.name}
          </h3>
          <p className="text-primary text-sm font-medium">{doctor.specialty}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <StarRating rating={doctor.rating} />
            <span className="text-xs font-bold text-textDark">{doctor.rating}</span>
            <span className="text-xs text-textMuted">({doctor.reviews})</span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-1.5 text-sm text-textMuted">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{doctor.location}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: '#10B981' }}>
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {doctor.nextSlot}
          </div>
          <span className="text-sm font-bold text-textDark">EGP {doctor.fee}</span>
        </div>
      </div>

      {/* Footer row */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-textMuted">{doctor.experience} yrs experience</span>
        <span className="text-primary font-semibold text-sm">Book →</span>
      </div>
    </CardLink>
  );
}
