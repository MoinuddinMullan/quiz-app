import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ enrollmentNumber: '', password: '' });
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
      const response = await api.post('/auth/login', form);
      login(response.data.token, response.data.student);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-sm rounded-xl border border-outline-variant/40 bg-surface-container/70 p-8 shadow-xl backdrop-blur-2xl">
        <h1 className="font-display text-2xl font-semibold text-on-surface">Welcome Back</h1>
        <p className="mt-1 text-sm text-on-surface-variant">WebTech Quiz Platform</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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

          {error ? <p className="text-sm text-error">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-xl bg-gradient-to-r from-primary-container to-primary font-semibold text-on-primary-container disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-on-surface-variant">
          Need an account?{' '}
          <Link to="/register" className="font-medium text-primary">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
