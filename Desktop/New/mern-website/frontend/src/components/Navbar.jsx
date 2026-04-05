import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar-custom">
      <div className="navbar-inner">
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
          </svg>
          <span>Smart Complaint Hub</span>
        </Link>

        {/* Right side */}
        <div className="navbar-actions">
          {user ? (
            <>
              <Link to="/profile" className="navbar-user-badge clickable">
                <span className="user-role-dot" data-role={user.role}></span>
                <div className="user-badge-text">
                  <span className="user-name">{user.name}</span>
                  <span className="user-role-label">{user.role === 'authority' ? user.authorityType : 'Student'}</span>
                </div>
              </Link>
              <button onClick={handleLogout} id="logout-btn" className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <div className="navbar-links">
              <Link to="/login" id="nav-login" className="btn-nav-outline">Login</Link>
              <Link to="/register" id="nav-register" className="btn-nav-solid">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
