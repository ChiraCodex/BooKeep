import express from 'express'
import { sql } from '../config/db.js';

const router = express.Router()

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const transactions = await sql`
      SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
    `;

    res.status(200).json(transactions);
  } catch (error) {
    console.log('Error getting the Transactions', error);
    res.status(500).json({ message: 'Internal Server error' });
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

    console.log(transaction);
    res.status(201).json(transaction);
  } catch (error) {
    console.log('Error creating Transaction', error);
    res.status(500).json({ message: 'Internal Server error' });
  }
});

//DELETE user Transaction
router.delete("/:id", async(req,res)=>{
  try {
    const {id} = req.params;
    
    if(isNaN(parseInt(id))) {
      return res.status(400).json({message: "Transaction Not Found"})
    }

    const result = await sql `
    DELETE FROM transactions WHERE id = ${id} RETURNING *
    `

    if(result.length === 0){
      return res.status(404).json({message: "Transaction not found"})
    } else{
      res.status(200).json({message: "Transaction Deleted Successfully"})
    }
  } catch (error) {
   console.log('Error deleting Transaction', error);
    res.status(500).json({ message: 'Internal Server error' }); 
  }
})

router.get("/summary/:userId", async(req, res) =>{
  try {
    const {userId} = req.params;

    const balanceResult = await sql
    `
    SELECT COALESCE(SUM(amount),0) as balance FROM  transactions WHERE user_id = ${userId}
    `

    const incomeResult = await sql `
    SELECT COALESCE(SUM(amount),0) as income FROM  transactions WHERE user_id = ${userId} AND amount > 0
    `

     const expensesResult = await sql `
    SELECT COALESCE(SUM(amount),0) as wxpense FROM  transactions WHERE user_id = ${userId} AND amount < 0
    `

    res.status(200).json({
      balance: balanceResult[0].balance,
       income: incomeResult[0].income,
        expenses: expensesResult[0].expenses,
    })

  } catch (error) {
   console.log('Error Getting Summary Transactions', error);
    res.status(500).json({ message: 'Internal Server error' });  
  }
})

export default router;