import express from 'express'
import { sql } from '../config/db.js';

const router = express.Router()

// GET all transactions for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const transactions = await sql`
      SELECT * FROM transactions 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC
    `;

    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error getting transactions:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST a new transaction
router.post('/', async (req, res) => {
  try {
    const { title, amount, category, user_id } = req.body;

    if (!title || !user_id || !category || amount === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const [transaction] = await sql`
      INSERT INTO transactions(user_id, title, amount, category)
      VALUES (${user_id}, ${title}, ${amount}, ${category})
      RETURNING *
    `;

    res.status(201).json(transaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// DELETE a transaction
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    const result = await sql`
      DELETE FROM transactions 
      WHERE id = ${id} 
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET financial summary
router.get("/summary/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const [balanceResult] = await sql`
      SELECT COALESCE(SUM(amount), 0) AS balance 
      FROM transactions 
      WHERE user_id = ${userId}
    `;

    const [incomeResult] = await sql`
      SELECT COALESCE(SUM(amount), 0) AS income 
      FROM transactions 
      WHERE user_id = ${userId} AND amount > 0
    `;

    const [expensesResult] = await sql`
      SELECT COALESCE(SUM(amount), 0) AS expenses 
      FROM transactions 
      WHERE user_id = ${userId} AND amount < 0
    `;

    res.status(200).json({
      balance: balanceResult?.balance || 0,
      income: incomeResult?.income || 0,
      expenses: expensesResult?.expenses || 0,
    });

  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).json({ 
      message: "Internal server error",
      balance: 0,
      income: 0,
      expenses: 0
    });
  }
});

export default router;