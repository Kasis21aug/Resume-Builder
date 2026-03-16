// Classic template — clean, professional, ATS-friendly
export default function Classic({ data }) {
  const { personalInfo: p, experience, education, skills } = data;

  return (
    <div style={{
      fontFamily: 'Georgia, serif',
      padding: '40px',
      maxWidth: '700px',
      color: '#1a1a2e',
      background: 'white',
      lineHeight: '1.5',
      fontSize: '14px',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px', borderBottom: '2px solid #1a1a2e', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '1px', marginBottom: '6px' }}>
          {p?.name || 'Your Name'}
        </h1>
        <div style={{ fontSize: '13px', color: '#4b5563', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px' }}>
          {p?.email    && <span>{p.email}</span>}
          {p?.phone    && <><span>·</span><span>{p.phone}</span></>}
          {p?.location && <><span>·</span><span>{p.location}</span></>}
          {p?.linkedin && <><span>·</span><span>{p.linkedin}</span></>}
        </div>
      </div>

      {/* Summary */}
      {p?.summary && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', borderBottom: '1px solid #d1d5db', paddingBottom: '4px', marginBottom: '10px', color: '#374151' }}>
            Summary
          </h2>
          <p style={{ color: '#4b5563' }}>{p.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', borderBottom: '1px solid #d1d5db', paddingBottom: '4px', marginBottom: '12px', color: '#374151' }}>
            Experience
          </h2>
          {experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <strong style={{ fontSize: '15px' }}>{exp.role || 'Role'}</strong>
                  <span style={{ color: '#6b7280' }}> — {exp.company || 'Company'}</span>
                </div>
                <span style={{ fontSize: '13px', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                  {exp.startDate} {exp.startDate && '–'} {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              {exp.bullets?.length > 0 && (
                <ul style={{ marginTop: '6px', paddingLeft: '20px', color: '#4b5563' }}>
                  {exp.bullets.filter(b => b.trim()).map((b, j) => (
                    <li key={j} style={{ marginBottom: '2px' }}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', borderBottom: '1px solid #d1d5db', paddingBottom: '4px', marginBottom: '12px', color: '#374151' }}>
            Education
          </h2>
          {education.map((edu, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div>
                <strong>{edu.degree} {edu.field ? `in ${edu.field}` : ''}</strong>
                <div style={{ color: '#6b7280', fontSize: '13px' }}>{edu.school}</div>
              </div>
              <span style={{ fontSize: '13px', color: '#9ca3af' }}>{edu.year}</span>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills?.length > 0 && (
        <div>
          <h2 style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', borderBottom: '1px solid #d1d5db', paddingBottom: '4px', marginBottom: '10px', color: '#374151' }}>
            Skills
          </h2>
          <p style={{ color: '#4b5563' }}>{skills.filter(s => s.trim()).join(' · ')}</p>
        </div>
      )}
    </div>
  );
}
