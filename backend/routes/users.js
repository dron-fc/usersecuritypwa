import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import usersController from '../controllers/users.js';

const router = express.Router();

const userRoutes = (db) => {
  router.get('/', 
    authenticate('admin'),
    (req, res) => usersController.getAllUsers(db, req, res)
  );
  return router;
};
export default userRoutes;
