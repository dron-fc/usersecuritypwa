import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export default {
  async login(db, req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findByEmail(db, email);
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async register(db, req, res) {
    try {
      const { email, password, role = 'user' } = req.body;
      
      const existingUser = await User.findByEmail(db, email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await User.create(db, {
        email,
        password: hashedPassword,
        role
      });

      res.status(201).json({
        id: user.id,
        email: user.email,
        role: user.role
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
