const express = require('express');
const cors = require('cors');
const ai = require('./ai');
const db = require('./db');
const beckn = require('./beckn');

const app = express();
app.use(cors());
app.use(express.json());

// New: Register user
app.post('/register-user', async (req, res) => {
  const newUser = req.body; // user data from frontend
  try {
    const userId = await db.saveUser(newUser);
    res.json({ success: true, userId });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Apply for loan: now only needs idNumber
app.post('/apply-loan', async (req, res) => {
  const { idNumber } = req.body;
  try {
    const user = await db.getUserByIdNumber(idNumber);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { score, approved } = ai.calculateScore(user);
    const loan = await db.saveLoan(user, score, approved);
    res.json({ score, approved, loanId: loan.id });
  } catch (error) {
    console.error('Error applying loan:', error);
    res.status(500).json({ error: 'Failed to apply loan' });
  }
});

// Get loan status
app.get('/loan/:id/status', async (req, res) => {
  try {
    const loan = await db.getLoan(req.params.id);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }
    res.json(loan);
  } catch (error) {
    console.error('Error getting loan:', error);
    res.status(500).json({ error: 'Failed to get loan' });
  }
});

// BECKN discovery
app.get('/beckn/search', beckn.search);

// Start server
app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});

