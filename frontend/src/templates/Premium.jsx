import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

// Premium template — elegant with gold accents
function PremiumLayout({ data }) {
  const { personalInfo: p, experience, education, skills } = data;

  return (
    <div style={{ fontFamily: "'Georgia', serif", padding: '40px', maxWidth: '700px', background: 'white', fontSize: '14px' }}>
      {/* Header with gold accent */}
      <div style={{ borderTop: '4px solid #d97706', paddingTop: '24px', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1c1917', letterSpacing: '0.5px', marginBottom: '4px' }}>
          {p?.name || 'Your Name'}
        </h1>
        <div style={{ height: '2px', width: '60px', background: '#d97706', marginBottom: '12px' }}></div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px', color: '#6b7280' }}>
          {p?.email    && <span>✉ {p.email}</span>}
          {p?.phone    && <span>☏ {p.phone}</span>}
          {p?.location && <span>⌖ {p.location}</span>}
          {p?.linkedin && <span>in {p.linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {p?.summary && (
        <div style={{ marginBottom: '24px', padding: '16px', background: '#fef9f0', borderLeft: '3px solid #d97706', borderRadius: '0 8px 8px 0' }}>
          <p style={{ color: '#44403c', lineHeight: '1.7', fontStyle: 'italic' }}>{p.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', color: '#d97706', marginBottom: '14px' }}>
            Professional Experience
          </h2>
          {experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: '18px', paddingBottom: '18px', borderBottom: i < experience.length - 1 ? '1px solid #f5f5f4' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <strong style={{ fontSize: '15px', color: '#1c1917' }}>{exp.role || 'Role'}</strong>
                  <div style={{ color: '#d97706', fontWeight: '600', fontSize: '13px' }}>{exp.company || 'Company'}</div>
                </div>
                <span style={{ fontSize: '13px', color: '#9ca3af' }}>
                  {exp.startDate} {exp.startDate && '–'} {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              {exp.bullets?.filter(b => b.trim()).length > 0 && (
                <ul style={{ marginTop: '8px', paddingLeft: '20px', color: '#44403c', lineHeight: '1.8' }}>
                  {exp.bullets.filter(b => b.trim()).map((b, j) => <li key={j}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education + Skills side by side */}
      <div style={{ display: 'flex', gap: '32px' }}>
        {education?.length > 0 && (
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', color: '#d97706', marginBottom: '12px' }}>Education</h2>
            {education.map((edu, i) => (
              <div key={i} style={{ marginBottom: '10px' }}>
                <strong style={{ color: '#1c1917' }}>{edu.degree} {edu.field ? `in ${edu.field}` : ''}</strong>
                <div style={{ color: '#6b7280', fontSize: '13px' }}>{edu.school} · {edu.year}</div>
              </div>
            ))}
          </div>
        )}
        {skills?.length > 0 && (
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', color: '#d97706', marginBottom: '12px' }}>Skills</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {skills.filter(s => s.trim()).map((skill, i) => (
                <span key={i} style={{ padding: '4px 12px', background: '#fef9f0', border: '1px solid #fed7aa', borderRadius: '20px', fontSize: '12px', color: '#92400e' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Premium template with lock overlay for free users
export default function Premium({ data }) {
  const { user, updateUser } = useAuth();
  const [upgrading, setUpgrading] = useState(false);
  const [upgraded, setUpgraded]   = useState(false);

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      await api.put('/auth/upgrade');
      updateUser({ isPremium: true });
      setUpgraded(true);
    } catch {
      alert('Upgrade failed. Please try again.');
    }
    setUpgrading(false);
  };

  // User is premium — show the full template
  if (user?.isPremium || upgraded) {
    return <PremiumLayout data={data} />;
  }

  // User is free — show blurred preview with lock overlay
  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '8px' }}>
      {/* Blurred background preview */}
      <div style={{ filter: 'blur(3px)', pointerEvents: 'none', userSelect: 'none', opacity: 0.6 }}>
        <PremiumLayout data={data} />
      </div>

      {/* Lock overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(255,255,255,0.85)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '32px',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔒</div>
        <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: '#1a1a2e' }}>
          Premium Template
        </h3>
        <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '24px', maxWidth: '280px', fontSize: '14px' }}>
          This elegant gold-accented template is available to premium users. Upgrade for free in this demo.
        </p>
        <button
          className="btn-primary"
          onClick={handleUpgrade}
          disabled={upgrading}
          style={{ padding: '12px 32px', fontSize: '15px', background: '#d97706' }}
        >
          {upgrading ? <><span className="spinner"></span>Upgrading...</> : '✨ Unlock Premium — Free'}
        </button>
        <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '12px' }}>
          No payment needed — this is a demo simulation
        </p>
      </div>
    </div>
  );
}
