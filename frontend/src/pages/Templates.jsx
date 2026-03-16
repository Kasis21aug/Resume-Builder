import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Classic from '../templates/Classic';
import Modern  from '../templates/Modern';
import Premium from '../templates/Premium';

const SAMPLE_DATA = {
  personalInfo: {
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    phone: '+91 98765 43210',
    location: 'Bangalore, India',
    summary: 'Experienced full-stack developer with 3+ years building scalable web applications using React and Node.js.',
  },
  experience: [{
    company: 'TechCorp India',
    role: 'Software Engineer',
    startDate: 'Jan 2022',
    endDate: '',
    current: true,
    bullets: ['Built 5 production features used by 50,000+ users', 'Reduced API response time by 40%'],
  }],
  education: [{ school: 'IIT Guwahati', degree: 'B.Tech', field: 'Computer Science', year: '2021' }],
  skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
};

const templates = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Clean, traditional layout. ATS-friendly and professional.',
    type: 'free',
    component: Classic,
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Two-column layout with a dark sidebar. Stands out visually.',
    type: 'free',
    component: Modern,
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Elegant gold-accented design. Makes a lasting impression.',
    type: 'premium',
    component: Premium,
  },
];

export default function Templates() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="page">
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>Choose a Template</h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>
            Pick a design that represents you. You can change it anytime in the builder.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '28px' }}>
          {templates.map((tpl) => {
            const Component = tpl.component;
            const isLocked = tpl.type === 'premium' && !user?.isPremium;

            return (
              <div key={tpl.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                {/* Preview (scaled down) */}
                <div style={{
                  height: '360px', overflow: 'hidden', position: 'relative',
                  background: '#f8fafc', borderBottom: '1px solid #e2e8f0',
                }}>
                  <div style={{ transform: 'scale(0.48)', transformOrigin: 'top left', width: '208%', pointerEvents: 'none' }}>
                    <Component data={SAMPLE_DATA} />
                  </div>
                  {isLocked && (
                    <div style={{
                      position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.5)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ fontSize: '40px' }}>🔒</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600' }}>{tpl.name}</h3>
                    <span className={`badge ${tpl.type === 'premium' ? 'badge-premium' : 'badge-free'}`}>
                      {tpl.type === 'premium' ? '✨ Premium' : '✓ Free'}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>{tpl.description}</p>
                  <button
                    className="btn-primary"
                    style={{ width: '100%' }}
                    onClick={() => navigate('/dashboard')}
                  >
                    {isLocked ? '🔒 Unlock in Builder' : 'Use this template'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
