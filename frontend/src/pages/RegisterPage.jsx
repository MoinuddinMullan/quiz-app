import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    enrollmentNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-sm rounded-xl border border-outline-variant/40 bg-surface-container/70 p-8 shadow-xl backdrop-blur-2xl">
        <h1 className="font-display text-2xl font-semibold text-on-surface">Create Account</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-lowest/80 px-4 py-3 text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <input
            name="enrollmentNumber"
            value={form.enrollmentNumber}
            onChange={handleChange}
            placeholder="Enrollment Number"
            className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-lowest/80 px-4 py-3 text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-lowest/80 px-4 py-3 text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-lowest/80 px-4 py-3 text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/50"
          />

          {error ? <p className="text-sm text-error">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-xl bg-primary-container font-semibold text-on-primary-container disabled:opacity-60"
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-on-surface-variant">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
