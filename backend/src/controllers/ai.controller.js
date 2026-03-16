const axios = require('axios');

const generate = async (req, res) => {
  const { type, data } = req.body;

  const prompts = {
    summary:
      `Write a 3-sentence professional resume summary.
Job title: ${data.jobTitle || 'Professional'}.
Skills: ${data.skills?.join(', ') || 'Not provided'}.
Return ONLY the summary text, nothing else.`,

    improve:
      `Improve this resume bullet point using strong action verbs and measurable impact.
Original: "${data.bullet || ''}"
Return ONLY the improved bullet, nothing else.`,

    skills:
      `List exactly 8 relevant skills for a ${data.jobTitle || 'professional'} role.
Return a comma-separated list only. Example: React, Node.js, REST APIs`,
  };

  if (!prompts[type])
    return res.status(400).json({ message: 'Invalid type. Use: summary, improve, or skills.' });

  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-your-openai-key-here')
    return res.status(500).json({ message: 'OpenAI API key not configured in .env file.' });

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a professional resume writer. Give concise, direct responses.' },
          { role: 'user',   content: prompts[type] },
        ],
        max_tokens: 300,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const text = response.data.choices[0].message.content.trim();
    res.json({ text });
  } catch (err) {
    if (err.response?.status === 401)
      return res.status(500).json({ message: 'Invalid OpenAI API key.' });
    if (err.response?.status === 429)
      return res.status(500).json({ message: 'OpenAI rate limit. Try again in a moment.' });
    res.status(500).json({ message: 'AI generation failed: ' + err.message });
  }
};

module.exports = { generate };
