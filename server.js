import express from 'express';
import dotenv from 'dotenv';
import { sql } from './config/db.js';
import ratelimit from './middleware/rateLimiter.js';
import transactionsRoute from './routes/transactionRoutes.js'

dotenv.config();

const app = express();
//middleware
app.use(ratelimit)
app.use(express.json());

const PORT = process.env.PORT || 5001;

async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS transactions(
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL (10,2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
      )
    `;
    console.log('Database Initialized successfully');
  } catch (error) {
    console.log('Error initializing DB', error);
    process.exit(1);
  }
}

app.use("/api/transactions", transactionsRoute)


// Start server after DB is initialized
initDB().then(() => {
  app.listen(PORT, () => {
    console.log('Server is running on PORT:', PORT);
  });
});
