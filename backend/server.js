require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const { connectDB } = require('./src/config/db');

connectDB();

const app = express();

// Allow both localhost (dev) and Netlify URL (production)
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());

app.get('/', (req, res) => res.json({ message: '🚀 Resume Builder API is running!' }));

app.use('/api/auth',    require('./src/routes/auth.routes'));
app.use('/api/resumes', require('./src/routes/resume.routes'));
app.use('/api/ai',      require('./src/routes/ai.routes'));

app.use((req, res) => res.status(404).json({ message: `Route ${req.originalUrl} not found.` }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log('Routes: /api/auth  /api/resumes  /api/ai\n');
});
