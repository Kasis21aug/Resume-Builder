require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./src/config/db');

const app = express();

connectDB();

const allowedOrigins = [
  "http://localhost:3000",
  "https://kasis-resume-builder.netlify.app"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    status: "success",
    message: "Resume Builder API is running"
  });
});

app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/resumes', require('./src/routes/resume.routes'));
app.use('/api/ai', require('./src/routes/ai.routes'));

app.use((req, res) => {
  res.status(404).json({
    error: `Route ${req.originalUrl} not found`
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

