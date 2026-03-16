import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import api from '../api/axios';

export default function Dashboard() {
  const [resumes, setResumes]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [creating, setCreating] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load all resumes when page opens
  useEffect(() => {
    api.get('/resumes')
      .then(res => setResumes(res.data))
      .catch(err => console.error('Failed to load resumes:', err))
      .finally(() => setLoading(false));
  }, []);

  // Create a blank resume and navigate to the builder
  const createNew = async () => {
    setCreating(true);
    try {
      const { data } = await api.post('/resumes', {
        title: 'My Resume',
        templateId: 'classic',
      });
      navigate(`/builder/${data._id}`);
    } catch (err) {
      alert('Failed to create resume. Please try again.');
    }
    setCreating(false);
  };

  // Delete a resume
  const deleteResume = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/resumes/${id}`);
      setResumes(resumes.filter(r => r._id !== id));
    } catch {
      alert('Failed to delete resume.');
    }
  };

  // Format date nicely
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  return (
    <>
      <Navbar />
      <div className="page">

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
              My Resumes
            </h1>
            <p style={{ color: '#64748b', fontSize: '14px' }}>
              Welcome back, {user?.name}! You have {resumes.length} resume{resumes.length !== 1 ? 's' : ''}.
            </p>
          </div>
          <button
            className="btn-primary"
            onClick={createNew}
            disabled={creating}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {creating ? <><span className="spinner"></span>Creating...</> : '+ New Resume'}
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
            <div className="spinner" style={{ width: '32px', height: '32px', borderWidth: '3px' }}></div>
            <p style={{ marginTop: '12px' }}>Loading your resumes...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && resumes.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📄</div>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
              No resumes yet
            </h2>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>
              Create your first resume and land your dream job!
            </p>
            <button className="btn-primary" onClick={createNew} disabled={creating}>
              {creating ? 'Creating...' : '+ Create my first resume'}
            </button>
          </div>
        )}

        {/* Resume cards grid */}
        {!loading && resumes.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
          }}>
            {resumes.map((resume) => (
              <div key={resume._id} className="card" style={{ position: 'relative', padding: '20px' }}>

                {/* Template badge */}
                <span className={`badge ${resume.templateId === 'premium' ? 'badge-premium' : 'badge-free'}`}
                  style={{ position: 'absolute', top: '16px', right: '16px' }}>
                  {resume.templateId}
                </span>

                {/* Resume icon */}
                <div style={{
                  width: '48px', height: '48px', background: '#eef2ff',
                  borderRadius: '10px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '22px', marginBottom: '12px'
                }}>
                  📋
                </div>

                {/* Title */}
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                  {resume.title}
                </h3>

                {/* Name if filled */}
                {resume.personalInfo?.name && (
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>
                    {resume.personalInfo.name}
                  </p>
                )}

                {/* Last updated */}
                <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>
                  Updated {formatDate(resume.updatedAt)}
                </p>

                {/* Stats row */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', fontSize: '12px', color: '#64748b' }}>
                  <span>💼 {resume.experience?.length || 0} jobs</span>
                  <span>🎓 {resume.education?.length || 0} schools</span>
                  <span>⚡ {resume.skills?.length || 0} skills</span>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn-primary btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => navigate(`/builder/${resume._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-danger btn-sm"
                    onClick={() => deleteResume(resume._id, resume.title)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
