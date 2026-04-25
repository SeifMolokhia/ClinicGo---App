// ============================================================
// Footer Component
// Simple dark footer with logo and copyright notice.
// ============================================================

const { Link: FooterLink } = ReactRouterDOM;

function Footer() {
  return (
    <footer className="bg-slate-900 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">

        <FooterLink to="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="font-sora font-bold text-white text-lg">
            Clinic<span className="text-medBlue">Go</span>
          </span>
        </FooterLink>

        <p className="text-sm text-slate-400">© 2026 ClinicGo. All rights reserved. Cairo, Egypt</p>
      </div>
    </footer>
  );
}
