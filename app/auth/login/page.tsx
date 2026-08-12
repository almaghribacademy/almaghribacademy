'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const role = data.user.role;
        let dashboardPath = '/dashboard';
        
        if (role === 'super_admin' || role === 'admin') {
          dashboardPath = '/admin/dashboard';
        } else if (role === 'staff') {
          dashboardPath = '/staff/dashboard';
        } else if (role === 'teacher') {
          dashboardPath = '/teachers/dashboard';
        } else if (role === 'student') {
          dashboardPath = '/students/dashboard';
        }
        
        router.push(dashboardPath);
      } else {
        // Handle different error types based on status code
        if (response.status === 401) {
          setError('❌ Invalid email or password. Please try again.');
        } else if (response.status === 403) {
          setError('❌ Your account is not active. Please contact support.');
        } else if (response.status === 404) {
          setError('❌ Account not found. Please check your email or register.');
        } else if (response.status === 400) {
          setError(data.message || '❌ Invalid request. Please check your input.');
        } else if (response.status === 500) {
          setError('❌ Server error. Please try again later.');
        } else {
          setError(data.message || '❌ Login failed. Please try again.');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('❌ Unable to connect to server. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Sign in to your account</h2>
        <p className="subtitle">
          Or{' '}
          <Link href="/auth/register">create a new account</Link>
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="super_admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}