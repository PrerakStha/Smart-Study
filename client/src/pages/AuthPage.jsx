import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const EMPTY_FORM = { name: '', email: '', password: '', confirmPassword: '', role: 'student' };

// Mirrors the backend Zod rules so users get instant feedback
function validate(mode, f) {
  const errors = {};
  if (mode === 'register' && f.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }
  if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) {
    errors.email = 'Enter a valid email address';
  }
  if (mode === 'register') {
    if (f.password.length < 8) errors.password = 'Password must be at least 8 characters';
    else if (!/[A-Za-z]/.test(f.password)) errors.password = 'Password must contain a letter';
    else if (!/[0-9]/.test(f.password)) errors.password = 'Password must contain a number';
    if (f.password !== f.confirmPassword) errors.confirmPassword = 'Passwords do not match';
  } else if (!f.password) {
    errors.password = 'Password is required';
  }
  return errors;
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm text-zinc-400">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}

const inputClass = (hasError) =>
  `w-full rounded-lg border bg-field px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-brand ${
    hasError ? 'border-red-400/70' : 'border-line'
  }`;

export default function AuthPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const isLogin = mode === 'login';

  const update = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((errs) => ({ ...errs, [name]: undefined }));
  };

  const switchMode = (next) => {
    setMode(next);
    setFieldErrors({});
    setServerError('');
    setForm((f) => ({ ...f, password: '', confirmPassword: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const errors = validate(mode, form);
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    setLoading(true);
    try {
      if (isLogin) {
        await login({ email: form.email.trim(), password: form.password, role: form.role });
      } else {
        await register({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          confirmPassword: form.confirmPassword,
          role: form.role,
        });
      }
      navigate(location.state?.from?.pathname || '/workspace', { replace: true });
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors?.length) {
        // Backend validation errors → show under the matching input
        const mapped = {};
        data.errors.forEach((x) => (mapped[x.field] = x.message));
        setFieldErrors(mapped);
      } else {
        setServerError(data?.message || 'Cannot reach the server. Is the backend running?');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left brand panel (hidden on small screens) */}
      <aside
        className="hidden flex-col justify-between p-16 lg:flex lg:w-1/2"
        style={{ background: 'linear-gradient(135deg, #8b8cf2 0%, #6c5ce0 45%, #5242d0 100%)' }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg font-bold text-[#5242d0]">
            S
          </div>
          <span className="text-xl font-semibold">Smart Study</span>
        </div>

        <div>
          <h1 className="max-w-md text-5xl font-bold leading-tight">
            Upload your notes. Get summaries, quizzes and flashcards in seconds.
          </h1>
          <ul className="mt-8 space-y-3 text-white/90">
            {['AI-generated study material', 'Track weak topics', 'Built for students & teachers'].map(
              (t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-white" />
                  {t}
                </li>
              )
            )}
          </ul>
        </div>

        <p className="text-sm text-white/80">Smart Study &nbsp;|&nbsp; Powered by Google Gemini</p>
      </aside>

      {/* Right form panel */}
      <main className="flex w-full items-center justify-center bg-surface px-6 py-10 lg:w-1/2">
        <div className="w-full max-w-[26rem]">
          {/* Logo shown on mobile only, since the left panel is hidden */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand font-bold text-surface">
              S
            </div>
            <span className="text-lg font-semibold">Smart Study</span>
          </div>

          {/* Login / Register tabs */}
          <div className="mb-8 grid grid-cols-2 rounded-xl bg-black/40 p-1.5">
            {[
              ['login', 'Login'],
              ['register', 'Register'],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => switchMode(key)}
                className={`rounded-lg py-2.5 text-sm font-medium transition ${
                  mode === key ? 'bg-field text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <h2 className="text-3xl font-bold">{isLogin ? 'Welcome back' : 'Create your account'}</h2>
          <p className="mb-7 mt-3 text-sm text-zinc-400">
            {isLogin
              ? 'Sign in to continue studying.'
              : 'Students and teachers sign up here. Your role is set at registration.'}
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {!isLogin && (
              <Field label="Full name" error={fieldErrors.name}>
                <input
                  name="name"
                  value={form.name}
                  onChange={update}
                  autoComplete="name"
                  placeholder="Your full name"
                  className={inputClass(fieldErrors.name)}
                />
              </Field>
            )}

            <Field label="Email" error={fieldErrors.email}>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={update}
                autoComplete="email"
                placeholder="student@college.edu.np"
                className={inputClass(fieldErrors.email)}
              />
            </Field>

            <Field label="Password" error={fieldErrors.password}>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={update}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                placeholder="••••••••"
                className={inputClass(fieldErrors.password)}
              />
            </Field>

            {!isLogin && (
              <Field label="Confirm password" error={fieldErrors.confirmPassword}>
                <input
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={update}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className={inputClass(fieldErrors.confirmPassword)}
                />
              </Field>
            )}

            <Field label="Role" error={fieldErrors.role}>
              <div className="relative">
                <select
                  name="role"
                  value={form.role}
                  onChange={update}
                  className={`${inputClass(fieldErrors.role)} cursor-pointer appearance-none pr-10`}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
                <svg
                  className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Field>

            {serverError && (
              <div
                role="alert"
                className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300"
              >
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-brand py-3 text-sm font-semibold text-surface transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Please wait…' : isLogin ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-400">
            {isLogin ? 'New here? ' : 'Already have an account? '}
            <button
              type="button"
              onClick={() => switchMode(isLogin ? 'register' : 'login')}
              className="text-zinc-200 underline-offset-4 hover:underline"
            >
              {isLogin ? 'Create an account' : 'Sign in'}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
