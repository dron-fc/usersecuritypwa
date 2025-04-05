import express from 'express';
import authController from '../controllers/auth.js';

const router = express.Router();

const authRoutes = (db) => {
  router.post('/login', (req, res) => authController.login(db, req, res));
  router.post('/register', (req, res) => authController.register(db, req, res));
  return router;
};
export default authRoutes;

