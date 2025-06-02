import express from 'express';
import { sql } from '../config/db.js';

const router = express.Router();

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const transactions = await sql`
      SELECT * FROM transactions WHERE user_id = ${userId}
    `;

    const income = transactions
      .filter(t => Number(t.amount) > 0)
      .reduce((acc, t) => acc + Number(t.amount), 0);

    const expenses = transactions
      .filter(t => Number(t.amount) < 0)
      .reduce((acc, t) => acc + Number(t.amount), 0);

    const balance = income + expenses;

    res.json({
      income,
      expenses,
      balance
    });
  } catch (err) {
    console.error('Error fetching summary:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
