// ============================================================
// Register Page
// Five-field form with full validation (including Egyptian
// mobile number format) and a loading spinner on submit.
// ============================================================

const { useState: useRegisterState } = React;
const { Link: RegisterLink, useNavigate: useRegisterNavigate } = ReactRouterDOM;

const EGYPTIAN_MOBILE = /^(010|011|012|015)\d{8}$/;

const FIELDS = [
  { name: 'fullName',        label: 'Full Name',        type: 'text',     placeholder: 'Ahmed Mohamed' },
  { name: 'email',           label: 'Email address',    type: 'email',    placeholder: 'you@example.com' },
  { name: 'mobile',          label: 'Mobile Number',    type: 'tel',      placeholder: '01xxxxxxxxx' },
  { name: 'password',        label: 'Password',         type: 'password', placeholder: 'Min. 6 characters' },
  { name: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: 'Repeat your password' },
];

function Register() {
  const navigate = useRegisterNavigate();

  const [form, setForm] = useRegisterState({
    fullName: '', email: '', mobile: '', password: '', confirmPassword: '',
  });
  const [errors,  setErrors]  = useRegisterState({});
  const [loading, setLoading] = useRegisterState(false);
  const [serverError, setServerError] = useRegisterState('');

  const validate = () => {
    const e = {};
    if (!form.fullName.trim())            e.fullName        = 'Full name is required';
    if (!form.email) {
      e.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Enter a valid email address';
    }
    if (!form.mobile) {
      e.mobile = 'Mobile number is required';
    } else if (!EGYPTIAN_MOBILE.test(form.mobile)) {
      e.mobile = 'Enter a valid Egyptian number (010/011/012/015 + 8 digits)';
    }
    if (!form.password) {
      e.password = 'Password is required';
    } else if (form.password.length < 6) {
      e.password = 'Password must be at least 6 characters';
    }
    if (!form.confirmPassword) {
      e.confirmPassword = 'Please confirm your password';
    } else if (form.password !== form.confirmPassword) {
      e.confirmPassword = 'Passwords do not match';
    }
    return e;
  };

  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setServerError('');
    setLoading(true);
    try {
      await window.api.register({
        name: form.fullName,
        email: form.email,
        password: form.password,
        mobile: form.mobile,
      });
      navigate('/');
    } catch (err) {
      setServerError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
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
            <h1 className="font-sora font-bold text-2xl text-textDark">Create your account</h1>
            <p className="text-textMuted text-sm mt-1">Join ClinicGo — it's free</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* Server-side error */}
            {serverError && (
              <div className="rounded-xl px-4 py-3 text-sm font-medium"
                style={{ background: '#fee2e2', border: '1px solid #fecaca', color: '#b91c1c' }}>
                {serverError}
              </div>
            )}

            {FIELDS.map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-semibold text-textDark mb-1.5">{label}</label>
                <input
                  type={type} name={name}
                  value={form[name]} onChange={handleChange}
                  placeholder={placeholder}
                  className={'input-field' + (errors[name] ? ' error' : '')}
                />
                {errors[name] && <p className="field-error">{errors[name]}</p>}
              </div>
            ))}

            {/* Privacy notice */}
            <div className="rounded-xl p-4 text-xs leading-relaxed"
              style={{ background: '#EEF5FF', border: '1px solid #c7d9f5', color: '#1A65D6' }}>
              By creating an account you agree to ClinicGo's{' '}
              <a href="#" className="underline font-semibold">Terms of Service</a> and{' '}
              <a href="#" className="underline font-semibold">Privacy Policy</a>.
              Your data is protected and will never be shared with third parties.
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Creating account…
                </>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-textMuted mt-7">
            Already have an account?{' '}
            <RegisterLink to="/login" className="text-primary font-bold hover:underline">Sign in</RegisterLink>
          </p>
        </div>
      </div>
    </div>
  );
}
