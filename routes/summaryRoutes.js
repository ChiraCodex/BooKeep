import express from 'express';
import { sql } from '../config/db.js';

const router = express.Router();

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const incomeResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS income
      FROM transactions
      WHERE user_id = ${userId} AND amount > 0
    `;
    const expensesResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS expenses
      FROM transactions
      WHERE user_id = ${userId} AND amount < 0
    `;
    const balanceResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS balance
      FROM transactions
      WHERE user_id = ${userId}
    `;

    res.json({
      income: Number(incomeResult[0].income),
      expenses: Number(expensesResult[0].expenses),
      balance: Number(balanceResult[0].balance),
    });
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
