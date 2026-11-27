import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { failStuckDocuments } from './services/generation.service.js';
import app from './app.js';

try {
  await connectDB();
  await failStuckDocuments();
  app.listen(env.port, () => console.log(`API running on http://localhost:${env.port}`));
} catch (err) {
  console.error('Failed to start server:', err.message);
  process.exit(1);
}
