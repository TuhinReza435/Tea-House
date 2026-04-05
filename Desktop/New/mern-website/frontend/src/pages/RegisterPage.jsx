import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const AUTHORITY_TYPES = [
  'Department', 'Hall provost', 'Transport office',
  'Chatro upodesta', 'Proctor', 'Pro VC', 'VC'
];
const DEPARTMENTS = ['CSE', 'EEE', 'ICT', 'ACCE', 'MATH'];

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'student',
    department: '', session: '', roll: '', authorityType: ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      login(data);
      toast.success(`Welcome, ${data.name}!`);
      navigate(data.role === 'student' ? '/student' : '/authority');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-icon-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
              <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z" />
            </svg>
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join ComplainHub today</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Name */}
          <div className="form-group">
            <label htmlFor="reg-name" className="form-label">Full Name</label>
            <input id="reg-name" name="name" type="text" placeholder="Md. Tuhin Reza" required
              className="form-input" value={form.name} onChange={handleChange} />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="reg-email" className="form-label">Email</label>
            <input id="reg-email" name="email" type="email" placeholder="you@example.com" required
              className="form-input" value={form.email} onChange={handleChange} />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="reg-password" className="form-label">Password</label>
            <input id="reg-password" name="password" type="password" placeholder="••••••••" required
              className="form-input" value={form.password} onChange={handleChange} />
          </div>

          {/* Role */}
          <div className="form-group">
            <label htmlFor="reg-role" className="form-label">I am a</label>
            <select id="reg-role" name="role" className="form-select" value={form.role} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="authority">Authority</option>
            </select>
          </div>

          {/* Student fields */}
          {form.role === 'student' && (
            <div className="role-fields">
              <div className="form-group">
                <label htmlFor="reg-department" className="form-label">Department</label>
                <select id="reg-department" name="department" className="form-select" value={form.department} onChange={handleChange}>
                  <option value="">Select department</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="reg-roll" className="form-label">Roll No.</label>
                  <input id="reg-roll" name="roll" type="text" placeholder="19CSE001" className="form-input"
                    value={form.roll} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="reg-session" className="form-label">Session</label>
                  <input id="reg-session" name="session" type="text" placeholder="2019-20" className="form-input"
                    value={form.session} onChange={handleChange} />
                </div>
              </div>
            </div>
          )}

          {/* Authority fields */}
          {form.role === 'authority' && (
            <div className="role-fields">
              <div className="form-group">
                <label htmlFor="reg-authority-type" className="form-label">Authority Type</label>
                <select id="reg-authority-type" name="authorityType" className="form-select" value={form.authorityType} onChange={handleChange}>
                  <option value="">Select authority type</option>
                  {AUTHORITY_TYPES.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>
          )}

          <button id="register-submit" type="submit" className="btn-primary" disabled={loading}>
            {loading ? <span className="spinner"></span> : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
