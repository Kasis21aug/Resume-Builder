import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar   from '../components/Navbar';
import Classic  from '../templates/Classic';
import Modern   from '../templates/Modern';
import Premium  from '../templates/Premium';
import api      from '../api/axios';

const TEMPLATES = {
  classic: Classic,
  modern:  Modern,
  premium: Premium,
};

// ── Small helper components ────────────────

function SectionHeader({ title, onAdd, addLabel }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
      <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a2e' }}>{title}</h3>
      {onAdd && (
        <button className="btn-secondary btn-sm" onClick={onAdd}>+ {addLabel}</button>
      )}
    </div>
  );
}

function AIButton({ label, onClick, loading, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      style={{
        background: loading ? '#e0e7ff' : '#eef2ff',
        color: '#4f46e5',
        border: '1px solid #c7d2fe',
        borderRadius: '6px',
        padding: '5px 10px',
        fontSize: '12px',
        fontWeight: '500',
        cursor: loading ? 'wait' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      }}
    >
      {loading ? <><span className="spinner" style={{ width: '12px', height: '12px', borderWidth: '2px' }}></span>Generating...</> : `✨ ${label}`}
    </button>
  );
}

// ── Main Builder component ─────────────────

export default function Builder() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const previewRef = useRef(null);

  const [resume, setResume]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [aiLoading, setAiLoading] = useState({}); // { fieldName: true/false }
  const [activeTab, setActiveTab] = useState('personal');

  // ── Load resume on mount ──────────────────
  useEffect(() => {
    api.get(`/resumes/${id}`)
      .then(res => {
        // Ensure arrays exist even if empty
        const data = res.data;
        if (!data.experience) data.experience = [];
        if (!data.education)  data.education  = [];
        if (!data.skills)     data.skills     = [];
        if (!data.personalInfo) data.personalInfo = {};
        setResume(data);
      })
      .catch(() => {
        alert('Resume not found.');
        navigate('/dashboard');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  // ── Update helpers ────────────────────────

  const setInfo = (field, value) => {
    setResume(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
    setSaved(false);
  };

  const setField = (field, value) => {
    setResume(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const updateExp = (index, field, value) => {
    const updated = [...resume.experience];
    updated[index] = { ...updated[index], [field]: value };
    setField('experience', updated);
  };

  const updateExpBullet = (expIndex, bulletIndex, value) => {
    const updated = [...resume.experience];
    const bullets = [...(updated[expIndex].bullets || [])];
    bullets[bulletIndex] = value;
    updated[expIndex] = { ...updated[expIndex], bullets };
    setField('experience', updated);
  };

  const addExp = () => {
    setField('experience', [...resume.experience, {
      company: '', role: '', startDate: '', endDate: '', current: false, bullets: [''],
    }]);
  };

  const removeExp = (index) => {
    setField('experience', resume.experience.filter((_, i) => i !== index));
  };

  const addBullet = (expIndex) => {
    const updated = [...resume.experience];
    updated[expIndex].bullets = [...(updated[expIndex].bullets || []), ''];
    setField('experience', updated);
  };

  const updateEdu = (index, field, value) => {
    const updated = [...resume.education];
    updated[index] = { ...updated[index], [field]: value };
    setField('education', updated);
  };

  const addEdu = () => {
    setField('education', [...resume.education, { school: '', degree: '', field: '', year: '' }]);
  };

  const removeEdu = (index) => {
    setField('education', resume.education.filter((_, i) => i !== index));
  };

  // ── Save ──────────────────────────────────
  const save = async () => {
    setSaving(true);
    try {
      await api.put(`/resumes/${id}`, resume);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('Failed to save. Please try again.');
    }
    setSaving(false);
  };

  // ── AI generation ─────────────────────────
  const callAI = async (type, extra = {}) => {
    setAiLoading(prev => ({ ...prev, [type]: true }));
    try {
      const { data } = await api.post('/ai/generate', {
        type,
        data: {
          jobTitle: resume.personalInfo?.name || 'Professional',
          skills: resume.skills || [],
          ...extra,
        },
      });

      if (type === 'summary') {
        setInfo('summary', data.text);
      } else if (type === 'skills') {
        const newSkills = data.text.split(',').map(s => s.trim()).filter(Boolean);
        setField('skills', newSkills);
      } else if (type.startsWith('improve_')) {
        const expIndex = parseInt(type.split('_')[1]);
        const bulletIndex = parseInt(type.split('_')[2]);
        updateExpBullet(expIndex, bulletIndex, data.text);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'AI generation failed. Check your OpenAI API key in the backend .env file.');
    }
    setAiLoading(prev => ({ ...prev, [type]: false }));
  };

  // ── PDF Download ──────────────────────────
  const downloadPDF = async () => {
    const html2pdf = (await import('html2pdf.js')).default;
    const element  = previewRef.current;
    if (!element) return;

    html2pdf()
      .set({
        margin: 0,
        filename: `${resume.personalInfo?.name || 'resume'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(element)
      .save();
  };

  // ── Tabs config ───────────────────────────
  const tabs = [
    { id: 'personal',    label: 'Personal' },
    { id: 'experience',  label: 'Experience' },
    { id: 'education',   label: 'Education' },
    { id: 'skills',      label: 'Skills' },
    { id: 'template',    label: 'Template' },
  ];

  // ── Render ────────────────────────────────
  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '80px', color: '#94a3b8' }}>
          <div className="spinner" style={{ width: '32px', height: '32px', borderWidth: '3px' }}></div>
          <p style={{ marginTop: '12px' }}>Loading resume...</p>
        </div>
      </>
    );
  }

  const PreviewComponent = TEMPLATES[resume.templateId] || Classic;

  return (
    <>
      <Navbar />
      <div style={{ display: 'flex', height: 'calc(100vh - 60px)', overflow: 'hidden' }}>

        {/* ── LEFT PANEL: Form ─────────────────── */}
        <div style={{
          width: '420px', flexShrink: 0, overflowY: 'auto',
          borderRight: '1px solid #e2e8f0', background: 'white',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
            <input
              value={resume.title}
              onChange={e => setField('title', e.target.value)}
              style={{ fontSize: '16px', fontWeight: '600', border: 'none', padding: '0', background: 'transparent', color: '#1a1a2e', width: '100%' }}
              placeholder="Resume title..."
            />
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', overflowX: 'auto' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '12px 14px', border: 'none', background: 'transparent',
                  fontSize: '13px', fontWeight: activeTab === tab.id ? '600' : '400',
                  color: activeTab === tab.id ? '#4f46e5' : '#64748b',
                  borderBottom: activeTab === tab.id ? '2px solid #4f46e5' : '2px solid transparent',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div style={{ padding: '20px', flex: 1 }}>

            {/* ── PERSONAL INFO ── */}
            {activeTab === 'personal' && (
              <div>
                <div className="form-group">
                  <label>Full name</label>
                  <input value={resume.personalInfo.name || ''} placeholder="Rahul Sharma"
                    onChange={e => setInfo('name', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={resume.personalInfo.email || ''} placeholder="rahul@example.com"
                    onChange={e => setInfo('email', e.target.value)} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="form-group">
                    <label>Phone</label>
                    <input value={resume.personalInfo.phone || ''} placeholder="+91 98765 43210"
                      onChange={e => setInfo('phone', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input value={resume.personalInfo.location || ''} placeholder="Bangalore, India"
                      onChange={e => setInfo('location', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label>LinkedIn</label>
                  <input value={resume.personalInfo.linkedin || ''} placeholder="linkedin.com/in/rahulsharma"
                    onChange={e => setInfo('linkedin', e.target.value)} />
                </div>
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    <label style={{ margin: 0 }}>Professional summary</label>
                    <AIButton
                      label="Generate"
                      loading={aiLoading['summary']}
                      onClick={() => callAI('summary')}
                    />
                  </div>
                  <textarea
                    value={resume.personalInfo.summary || ''}
                    placeholder="A brief, compelling summary of your professional background..."
                    rows={4}
                    onChange={e => setInfo('summary', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* ── EXPERIENCE ── */}
            {activeTab === 'experience' && (
              <div>
                <SectionHeader title="Work Experience" onAdd={addExp} addLabel="Add Job" />
                {resume.experience.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '32px', color: '#94a3b8', fontSize: '13px', border: '2px dashed #e2e8f0', borderRadius: '8px' }}>
                    <p>No experience added yet.</p>
                    <button className="btn-secondary btn-sm" style={{ marginTop: '8px' }} onClick={addExp}>+ Add your first job</button>
                  </div>
                )}
                {resume.experience.map((exp, i) => (
                  <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#4f46e5' }}>Job #{i + 1}</span>
                      <button className="btn-danger btn-sm" onClick={() => removeExp(i)}>Remove</button>
                    </div>
                    <div className="form-group">
                      <label>Job title / Role</label>
                      <input value={exp.role || ''} placeholder="Software Engineer"
                        onChange={e => updateExp(i, 'role', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Company</label>
                      <input value={exp.company || ''} placeholder="Company name"
                        onChange={e => updateExp(i, 'company', e.target.value)} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div className="form-group">
                        <label>Start date</label>
                        <input value={exp.startDate || ''} placeholder="Jan 2022"
                          onChange={e => updateExp(i, 'startDate', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>End date</label>
                        <input value={exp.endDate || ''} placeholder="Dec 2023 or Present"
                          disabled={exp.current}
                          onChange={e => updateExp(i, 'endDate', e.target.value)} />
                      </div>
                    </div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input type="checkbox" id={`current-${i}`} checked={exp.current || false}
                        onChange={e => updateExp(i, 'current', e.target.checked)}
                        style={{ width: 'auto' }} />
                      <label htmlFor={`current-${i}`} style={{ margin: 0, cursor: 'pointer' }}>Currently working here</label>
                    </div>

                    {/* Bullets */}
                    <div>
                      <label>Bullet points (achievements)</label>
                      {(exp.bullets || []).map((bullet, j) => (
                        <div key={j} style={{ display: 'flex', gap: '6px', marginBottom: '6px', alignItems: 'flex-start' }}>
                          <textarea
                            value={bullet}
                            placeholder="Built X feature that improved Y by Z%"
                            rows={2}
                            onChange={e => updateExpBullet(i, j, e.target.value)}
                            style={{ flex: 1, fontSize: '13px' }}
                          />
                          <AIButton
                            label="Improve"
                            loading={aiLoading[`improve_${i}_${j}`]}
                            disabled={!bullet.trim()}
                            onClick={() => callAI(`improve_${i}_${j}`, { bullet })}
                          />
                        </div>
                      ))}
                      <button className="btn-secondary btn-sm" onClick={() => addBullet(i)} style={{ marginTop: '4px' }}>
                        + Add bullet
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── EDUCATION ── */}
            {activeTab === 'education' && (
              <div>
                <SectionHeader title="Education" onAdd={addEdu} addLabel="Add School" />
                {resume.education.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '32px', color: '#94a3b8', fontSize: '13px', border: '2px dashed #e2e8f0', borderRadius: '8px' }}>
                    <p>No education added yet.</p>
                    <button className="btn-secondary btn-sm" style={{ marginTop: '8px' }} onClick={addEdu}>+ Add education</button>
                  </div>
                )}
                {resume.education.map((edu, i) => (
                  <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#4f46e5' }}>Education #{i + 1}</span>
                      <button className="btn-danger btn-sm" onClick={() => removeEdu(i)}>Remove</button>
                    </div>
                    <div className="form-group">
                      <label>School / University</label>
                      <input value={edu.school || ''} placeholder="IIT Guwahati"
                        onChange={e => updateEdu(i, 'school', e.target.value)} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div className="form-group">
                        <label>Degree</label>
                        <input value={edu.degree || ''} placeholder="B.Tech"
                          onChange={e => updateEdu(i, 'degree', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Field of study</label>
                        <input value={edu.field || ''} placeholder="Computer Science"
                          onChange={e => updateEdu(i, 'field', e.target.value)} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Graduation year</label>
                      <input value={edu.year || ''} placeholder="2022"
                        onChange={e => updateEdu(i, 'year', e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── SKILLS ── */}
            {activeTab === 'skills' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '600' }}>Skills</h3>
                  <AIButton
                    label="Suggest skills"
                    loading={aiLoading['skills']}
                    onClick={() => callAI('skills')}
                  />
                </div>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '12px' }}>
                  One skill per line. Press Enter to add more.
                </p>
                <textarea
                  value={(resume.skills || []).join('\n')}
                  placeholder={"React\nNode.js\nMongoDB\nTypeScript\nREST APIs"}
                  rows={10}
                  onChange={e => {
                    const skills = e.target.value.split('\n').map(s => s.trimStart());
                    setField('skills', skills);
                  }}
                />
                <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>
                  {(resume.skills || []).filter(s => s.trim()).length} skills added
                </p>
              </div>
            )}

            {/* ── TEMPLATE ── */}
            {activeTab === 'template' && (
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>Choose template</h3>
                {[
                  { id: 'classic', name: 'Classic', desc: 'Clean, traditional. ATS-friendly.', free: true },
                  { id: 'modern',  name: 'Modern',  desc: 'Two-column with dark sidebar.',     free: true },
                  { id: 'premium', name: 'Premium', desc: 'Elegant gold accents.',             free: false },
                ].map(tpl => (
                  <div
                    key={tpl.id}
                    onClick={() => setField('templateId', tpl.id)}
                    style={{
                      border: `2px solid ${resume.templateId === tpl.id ? '#4f46e5' : '#e2e8f0'}`,
                      borderRadius: '10px', padding: '14px 16px', marginBottom: '10px',
                      cursor: 'pointer', background: resume.templateId === tpl.id ? '#eef2ff' : 'white',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontWeight: '600', fontSize: '14px' }}>{tpl.name}</span>
                        <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{tpl.desc}</p>
                      </div>
                      <span className={`badge ${tpl.free ? 'badge-free' : 'badge-premium'}`}>
                        {tpl.free ? 'Free' : '✨ Pro'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save + Download buttons */}
          <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '10px' }}>
            <button
              className={saved ? 'btn-success' : 'btn-primary'}
              style={{ flex: 1 }}
              onClick={save}
              disabled={saving}
            >
              {saving ? <><span className="spinner"></span>Saving...</> : saved ? '✓ Saved!' : 'Save Resume'}
            </button>
            <button className="btn-secondary" onClick={downloadPDF}>
              ⬇ PDF
            </button>
          </div>
        </div>

        {/* ── RIGHT PANEL: Live preview ─────────── */}
        <div style={{ flex: 1, overflowY: 'auto', background: '#f5f7fa', padding: '24px' }}>
          <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Live Preview — {resume.templateId} template
            </span>
            <button className="btn-primary btn-sm" onClick={downloadPDF}>
              ⬇ Download PDF
            </button>
          </div>
          <div ref={previewRef} style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden', background: 'white', display: 'inline-block', minWidth: '100%' }}>
            <PreviewComponent data={resume} />
          </div>
        </div>
      </div>
    </>
  );
}
