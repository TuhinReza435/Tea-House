import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ComplaintCard from '../components/ComplaintCard';

const AuthorityDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState({});
  const [comments, setComments] = useState({});   
  const fetchComplaints = async () => {
    try {
      const { data } = await api.get('/complaints/authority');
      setComplaints(data);
    } catch {
      toast.error('Failed to load complaints');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchComplaints(); }, []);

  const updateStatus = async (id, status) => {
    setLoading(prev => ({ ...prev, [id]: status }));
    try {
      await api.put(`/complaints/${id}/status`, {
        status,
        comment: comments[id] || ''
      });
      toast.success(`Complaint ${status} successfully`);
      setComments(prev => ({ ...prev, [id]: '' }));
      fetchComplaints();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setLoading(prev => ({ ...prev, [id]: null }));
    }
  };

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    accepted: complaints.filter(c => c.status === 'accepted').length,
  };

  const renderActions = (complaint) => {
    const isLoading = loading[complaint._id];
    return (
      <div className="action-group">
        <div className="form-group">
          <textarea
            className="form-textarea small"
            rows={2}
            placeholder="Optional comment..."
            value={comments[complaint._id] || ''}
            onChange={e => setComments(prev => ({ ...prev, [complaint._id]: e.target.value }))}
          />
        </div>
        <div className="action-btns">
          {complaint.status === 'pending' && (
            <button
              id={`accept-${complaint._id}`}
              className="btn-action info"
              disabled={!!isLoading}
              onClick={() => updateStatus(complaint._id, 'accepted')}
            >
              {isLoading === 'accepted' ? <span className="spinner sm"></span> : '✓ Accept'}
            </button>
          )}
          <button
            id={`solve-${complaint._id}`}
            className="btn-action success"
            disabled={!!isLoading}
            onClick={() => updateStatus(complaint._id, 'solved')}
          >
            {isLoading === 'solved' ? <span className="spinner sm"></span> : '✔ Solve'}
          </button>
          <button
            id={`reject-${complaint._id}`}
            className="btn-action danger"
            disabled={!!isLoading}
            onClick={() => updateStatus(complaint._id, 'rejected')}
          >
            {isLoading === 'rejected' ? <span className="spinner sm"></span> : '✕ Reject'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-page">
      {/* Banner */}
      <div className="dashboard-banner authority-banner">
        <div className="banner-text">
          <h1 className="banner-title">{user?.authorityType} Panel</h1>
          <p className="banner-subtitle">Review and manage complaints assigned to you</p>
        </div>
        <div className="stats-row">
          <div className="stat-chip"><span className="stat-num">{stats.total}</span><span>Total</span></div>
          <div className="stat-chip warning"><span className="stat-num">{stats.pending}</span><span>Pending</span></div>
          <div className="stat-chip info"><span className="stat-num">{stats.accepted}</span><span>Accepted</span></div>
        </div>
      </div>

      {/* Complaints */}
      <div className="authority-content">
        <div className="panel">
          <div className="panel-header">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M5.625 3.75a2.625 2.625 0 100 5.25h12.75a2.625 2.625 0 000-5.25H5.625zM3.75 11.25a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75zM3 15.75a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zM3.75 18.75a.75.75 0 000 1.5H12a.75.75 0 000-1.5H3.75z" />
            </svg>
            <h2 className="panel-title">Assigned Complaints</h2>
          </div>

          {fetching ? (
            <div className="loading-state">
              <span className="spinner big"></span>
              <p>Loading complaints...</p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="48" height="48">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No complaints assigned to you.<br/>All clear!</p>
            </div>
          ) : (
            <div className="complaints-list">
              {complaints.map(c => (
                <ComplaintCard key={c._id} complaint={c} actions={renderActions(c)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorityDashboard;
