import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/auth/profile');
      setProfile(data);
      // Sync AuthContext with latest data from DB
      const updatedUser = { ...user, ...data };
      login(updatedUser);
    } catch (err) {
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <span className="spinner big"></span>
        <p>Fetching your profile...</p>
      </div>
    );
  }

  const isAuthority = profile?.role === 'authority';

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {profile?.name?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="profile-title-area">
              <h1 className="profile-name">{profile?.name}</h1>
              <p className="profile-role-tag">
                {isAuthority ? profile?.authorityType : 'Student Account'}
              </p>
            </div>
          </div>

          <div className="profile-body">
            <h2 className="section-title">Account Information</h2>
            
            <div className="info-grid">
              <div className="info-item">
                <label>Email Address</label>
                <div className="info-value">{profile?.email}</div>
              </div>

              <div className="info-item">
                <label>User Role</label>
                <div className="info-value capitalize">{profile?.role}</div>
              </div>

              {!isAuthority && (
                <>
                  <div className="info-item">
                    <label>Department</label>
                    <div className="info-value">{profile?.department || 'Not Set'}</div>
                  </div>
                  <div className="info-item">
                    <label>Roll Number</label>
                    <div className="info-value">{profile?.roll || 'Not Set'}</div>
                  </div>
                  <div className="info-item">
                    <label>Session</label>
                    <div className="info-value">{profile?.session || 'Not Set'}</div>
                  </div>
                </>
              )}

              {isAuthority && (
                <div className="info-item">
                  <label>Authority Type</label>
                  <div className="info-value">{profile?.authorityType}</div>
                </div>
              )}
            </div>

            <div className="profile-footer">
              <p className="joined-date">
                Member since {new Date(profile?.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Support Card */}
        <div className="support-card">
          <h3>Need to change something?</h3>
          <p>If your information is incorrect, please contact the system administrator to update your records.</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
