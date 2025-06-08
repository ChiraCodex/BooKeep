import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { sql } from './config/db.js';
import ratelimit from './middleware/rateLimiter.js';
import transactionsRoute from './routes/transactionRoutes.js';
import summaryRoute from './routes/summaryRoutes.js'; // Make sure this file exists

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;


app.use(cors());

app.use(express.json());    
app.use(ratelimit);         

// ✅ Routes
app.use('/transactions', transactionsRoute);
app.use('/summary', summaryRoute); 


async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
      );
    `;
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing DB:', error);
    process.exit(1);
  }
}

// ✅ Start server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
  });
});
