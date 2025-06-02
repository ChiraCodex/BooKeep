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

// ✅ Fix CORS: allow from all origins or restrict as needed
app.use(cors()); // For dev: allow all. For prod, pass options.

app.use(express.json());     // Parse incoming JSON
app.use(ratelimit);          // Apply rate limiting (after CORS & JSON)

// ✅ Routes
app.use('/api/transactions', transactionsRoute);
app.use('/api/summary', summaryRoute); // Mount summary route correctly

// ✅ Initialize DB
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
    console.log(`🚀 Server running on PORT: ${PORT}`);
  });
});
