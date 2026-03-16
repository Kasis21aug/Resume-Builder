// Modern template — two-column layout with colored sidebar
export default function Modern({ data }) {
  const { personalInfo: p, experience, education, skills } = data;

  const sidebarStyle = {
    width: '220px',
    flexShrink: 0,
    background: '#1e293b',
    color: 'white',
    padding: '32px 20px',
  };

  const mainStyle = {
    flex: 1,
    padding: '32px 28px',
    background: 'white',
  };

  const sideHeading = {
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: '#94a3b8',
    borderBottom: '1px solid #334155',
    paddingBottom: '6px',
    marginBottom: '12px',
    marginTop: '20px',
  };

  const mainHeading = {
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: '#4f46e5',
    borderBottom: '2px solid #e0e7ff',
    paddingBottom: '4px',
    marginBottom: '14px',
    marginTop: '20px',
  };

  return (
    <div style={{ display: 'flex', maxWidth: '700px', minHeight: '900px', fontFamily: 'Arial, sans-serif', fontSize: '13px', background: 'white' }}>

      {/* ── Sidebar ── */}
      <div style={sidebarStyle}>
        {/* Avatar placeholder */}
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 16px' }}>
          {(p?.name || 'Y')[0].toUpperCase()}
        </div>
        <h1 style={{ fontSize: '18px', fontWeight: '700', textAlign: 'center', lineHeight: '1.3', marginBottom: '4px' }}>
          {p?.name || 'Your Name'}
        </h1>

        {/* Contact */}
        <div style={sideHeading}>Contact</div>
        {p?.email    && <div style={{ marginBottom: '6px', wordBreak: 'break-all', fontSize: '12px', color: '#cbd5e1' }}>{p.email}</div>}
        {p?.phone    && <div style={{ marginBottom: '6px', fontSize: '12px', color: '#cbd5e1' }}>{p.phone}</div>}
        {p?.location && <div style={{ marginBottom: '6px', fontSize: '12px', color: '#cbd5e1' }}>{p.location}</div>}
        {p?.linkedin && <div style={{ marginBottom: '6px', fontSize: '12px', color: '#cbd5e1', wordBreak: 'break-all' }}>{p.linkedin}</div>}

        {/* Skills */}
        {skills?.length > 0 && (
          <>
            <div style={sideHeading}>Skills</div>
            {skills.filter(s => s.trim()).map((skill, i) => (
              <div key={i} style={{ marginBottom: '6px' }}>
                <div style={{ fontSize: '12px', color: '#e2e8f0', marginBottom: '3px' }}>{skill}</div>
                <div style={{ height: '4px', background: '#334155', borderRadius: '2px' }}>
                  <div style={{ height: '4px', background: '#818cf8', borderRadius: '2px', width: '75%' }}></div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <>
            <div style={sideHeading}>Education</div>
            {education.map((edu, i) => (
              <div key={i} style={{ marginBottom: '10px' }}>
                <div style={{ fontWeight: '600', fontSize: '12px' }}>{edu.degree}</div>
                {edu.field && <div style={{ fontSize: '11px', color: '#94a3b8' }}>{edu.field}</div>}
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>{edu.school}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>{edu.year}</div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* ── Main content ── */}
      <div style={mainStyle}>
        {/* Summary */}
        {p?.summary && (
          <>
            <div style={{ ...mainHeading, marginTop: '0' }}>Profile</div>
            <p style={{ color: '#4b5563', lineHeight: '1.6' }}>{p.summary}</p>
          </>
        )}

        {/* Experience */}
        {experience?.length > 0 && (
          <>
            <div style={mainHeading}>Experience</div>
            {experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <strong style={{ fontSize: '14px', color: '#1e293b' }}>{exp.role || 'Role'}</strong>
                    <div style={{ color: '#4f46e5', fontSize: '13px', fontWeight: '500' }}>{exp.company || 'Company'}</div>
                  </div>
                  <span style={{ fontSize: '12px', color: '#94a3b8', whiteSpace: 'nowrap', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>
                    {exp.startDate} {exp.startDate && '–'} {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.bullets?.length > 0 && (
                  <ul style={{ marginTop: '6px', paddingLeft: '18px', color: '#4b5563', lineHeight: '1.7' }}>
                    {exp.bullets.filter(b => b.trim()).map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
