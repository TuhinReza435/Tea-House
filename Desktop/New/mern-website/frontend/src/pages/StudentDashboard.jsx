import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ComplaintCard from '../components/ComplaintCard';

const AUTHORITY_TYPES = [
  'Department', 'Hall provost', 'Transport office',
  'Chatro upodesta', 'Proctor', 'Pro VC', 'VC'
];

const StudentDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ description: '', currentAuthority: '' });

  const fetchComplaints = async () => {
    try {
      const { data } = await api.get('/complaints/me');
      setComplaints(data);
    } catch {
      toast.error('Failed to load complaints');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchComplaints(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description.trim() || !form.currentAuthority) {
      toast.error('Please fill in all fields');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/complaints', form);
      toast.success('Complaint submitted successfully!');
      setForm({ description: '', currentAuthority: '' });
      fetchComplaints();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    solved: complaints.filter(c => c.status === 'solved').length,
    rejected: complaints.filter(c => c.status === 'rejected').length,
  };

  return (
    <div className="dashboard-page">
      {/* Welcome Banner */}
      <div className="dashboard-banner">
        <div className="banner-text">
          <h1 className="banner-title">Hello, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="banner-subtitle">Submit and track your complaints here</p>
        </div>
        <div className="stats-row">
          <div className="stat-chip"><span className="stat-num">{stats.total}</span><span>Total</span></div>
          <div className="stat-chip warning"><span className="stat-num">{stats.pending}</span><span>Pending</span></div>
          <div className="stat-chip success"><span className="stat-num">{stats.solved}</span><span>Solved</span></div>
          <div className="stat-chip error"><span className="stat-num">{stats.rejected}</span><span>Rejected</span></div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Submit Complaint */}
        <section className="panel">
          <div className="panel-header">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
            </svg>
            <h2 className="panel-title">New Complaint</h2>
          </div>
          <form onSubmit={handleSubmit} className="complaint-form">
            <div className="form-group">
              <label htmlFor="complaint-authority" className="form-label">Direct complaint to</label>
              <select id="complaint-authority" className="form-select" value={form.currentAuthority}
                onChange={e => setForm({ ...form, currentAuthority: e.target.value })}>
                <option value="">Select authority...</option>
                {AUTHORITY_TYPES.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="complaint-desc" className="form-label">Description</label>
              <textarea id="complaint-desc" className="form-textarea" rows={5}
                placeholder="Describe your complaint in detail..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <button id="submit-complaint-btn" type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? <span className="spinner"></span> : 'Submit Complaint'}
            </button>
          </form>
        </section>

        {/* My Complaints */}
        <section className="panel complaints-panel">
          <div className="panel-header">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path fillRule="evenodd" d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 003 3h15a3 3 0 01-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125zM12 9.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H12zm-.75-2.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H12a.75.75 0 01-.75-.75zM6 12.75a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5H6zm-.75 3.75a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75zM6 6.75a.75.75 0 000 1.5h3a.75.75 0 000-1.5H6z" clipRule="evenodd" />
            </svg>
            <h2 className="panel-title">My Complaints</h2>
          </div>

          {fetching ? (
            <div className="loading-state">
              <span className="spinner big"></span>
              <p>Loading your complaints...</p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="48" height="48">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <p>No complaints yet.<br/>Submit your first one!</p>
            </div>
          ) : (
            <div className="complaints-list">
              {complaints.map(c => <ComplaintCard key={c._id} complaint={c} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default StudentDashboard;
