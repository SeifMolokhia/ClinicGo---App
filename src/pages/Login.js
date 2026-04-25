// ============================================================
// Login Page
// Form with email + password fields, validation, loading state.
// ============================================================

const { useState: useLoginState } = React;
const { Link: LoginLink, useNavigate: useLoginNavigate } = ReactRouterDOM;

function Login() {
  const navigate = useLoginNavigate();

  const [form,    setForm]    = useLoginState({ email: '', password: '', remember: false });
  const [errors,  setErrors]  = useLoginState({});
  const [loading, setLoading] = useLoginState(false);

  // Validation rules
  const validate = () => {
    const e = {};
    if (!form.email) {
      e.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Enter a valid email address';
    }
    if (!form.password) {
      e.password = 'Password is required';
    } else if (form.password.length < 6) {
      e.password = 'Password must be at least 6 characters';
    }
    return e;
  };

  const handleChange = ({ target: { name, value, type, checked } }) => {
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    // Clear error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    navigate('/');
  };

  return (
    <div className="fade-in min-h-screen bg-bgLight flex items-center justify-center px-4 py-12">
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div className="bg-white rounded-3xl p-8 sm:p-10" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9' }}>

          {/* Logo header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-2xl mb-4"
              style={{ boxShadow: '0 4px 12px rgba(26,101,214,0.3)' }}>
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h1 className="font-sora font-bold text-2xl text-textDark">Welcome back</h1>
            <p className="text-textMuted text-sm mt-1">Sign in to your ClinicGo account</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-textDark mb-1.5">Email address</label>
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} placeholder="you@example.com"
                className={'input-field' + (errors.email ? ' error' : '')}
              />
              {errors.email && <p className="field-error">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-textDark mb-1.5">Password</label>
              <input
                type="password" name="password" value={form.password}
                onChange={handleChange} placeholder="Min. 6 characters"
                className={'input-field' + (errors.password ? ' error' : '')}
              />
              {errors.password && <p className="field-error">{errors.password}</p>}
            </div>

            {/* Remember + forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox" name="remember" checked={form.remember}
                  onChange={handleChange}
                  style={{ width: 16, height: 16, accentColor: '#1A65D6' }}
                />
                <span className="text-sm text-textMuted">Remember me</span>
              </label>
              <a href="#" className="text-sm text-primary font-semibold hover:underline">Forgot password?</a>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Signing in…
                </>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-textMuted mt-7">
            Don't have an account?{' '}
            <LoginLink to="/register" className="text-primary font-bold hover:underline">Create one</LoginLink>
          </p>
        </div>
      </div>
    </div>
  );
}
