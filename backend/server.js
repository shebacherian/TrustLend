const express = require('express');
const cors = require('cors');
const ai = require('./services/ai');
const beckn = require('./services/beckn');
const db = require('./db/db');
const authService = require('./services/authService');

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const partnerRoutes = require('./routes/partner');
const historyRoutes = require('./routes/history');

// Public routes
app.use('/auth', authRoutes);
app.use('/partner', partnerRoutes);
app.use('/history', historyRoutes);

// Example protected route
app.get('/secure/test', (req, res) => {
  const token = req.headers['authorization'];
  const user = authService.verifyToken(token);
  if (!user) return res.status(401).json({ error: 'Invalid token' });
  res.json({ message: `Hello ${user.name}, this is protected.` });
});

// Your existing register-user, apply-loan etc...
// keep your register-user and apply-loan here

app.listen(3000, () => console.log('🚀 Server running http://localhost:3000'));
