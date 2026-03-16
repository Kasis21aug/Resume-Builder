import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">
        📄 ResumeAI
      </Link>
      <div className="navbar-right">
        {user && (
          <>
            <Link to="/templates" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}>
              Templates
            </Link>
            <span className="navbar-user">
              {user.name}
              {user.isPremium && (
                <span className="badge badge-premium" style={{ marginLeft: '6px' }}>PRO</span>
              )}
            </span>
            <button className="btn-secondary btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
