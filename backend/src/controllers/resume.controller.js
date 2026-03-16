const { supabase } = require('../config/db');

// ─────────────────────────────────────────
// GET /api/resumes
// ─────────────────────────────────────────
const getAll = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', req.userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────
// GET /api/resumes/:id
// ─────────────────────────────────────────
const getOne = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.userId)   // security: only owner can read
      .single();

    if (error || !data)
      return res.status(404).json({ message: 'Resume not found.' });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────
// POST /api/resumes
// ─────────────────────────────────────────
const create = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('resumes')
      .insert({
        user_id:      req.userId,
        title:        req.body.title        || 'My Resume',
        template_id:  req.body.templateId   || 'classic',
        personal_info: req.body.personalInfo || {},
        experience:   req.body.experience   || [],
        education:    req.body.education    || [],
        skills:       req.body.skills       || [],
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────
// PUT /api/resumes/:id
// ─────────────────────────────────────────
const update = async (req, res) => {
  try {
    // Build update object from request body
    const updates = {};
    if (req.body.title        !== undefined) updates.title         = req.body.title;
    if (req.body.templateId   !== undefined) updates.template_id   = req.body.templateId;
    if (req.body.personalInfo !== undefined) updates.personal_info = req.body.personalInfo;
    if (req.body.experience   !== undefined) updates.experience    = req.body.experience;
    if (req.body.education    !== undefined) updates.education     = req.body.education;
    if (req.body.skills       !== undefined) updates.skills        = req.body.skills;

    const { data, error } = await supabase
      .from('resumes')
      .update(updates)
      .eq('id', req.params.id)
      .eq('user_id', req.userId)  // security: only owner can update
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ message: 'Resume not found.' });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────
// DELETE /api/resumes/:id
// ─────────────────────────────────────────
const remove = async (req, res) => {
  try {
    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.userId);  // security: only owner can delete

    if (error) throw error;
    res.json({ message: 'Resume deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAll, getOne, create, update, remove };
