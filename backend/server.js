import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import authRoutes from './routes/auth.js'; // Добавлен импорт
import userRoutes from './routes/users.js'; // Добавлен импорт

dotenv.config();

async function startServer() {
  const app = express();
  const db = await connectDB();

  // Инициализация БД
  await User.init(db);

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Роуты
  app.use('/api/auth', authRoutes(db));
  app.use('/api/users', userRoutes(db));

  // Запуск сервера
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
