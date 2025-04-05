import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export default {
  // Получение всех пользователей (только для админа)
  async getAll(req, res) {
    try {
      // Проверка прав
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Admin access required'
        });
      }

      const users = await User.find().select('-password');
      res.json(users);
    } catch (err) {
      res.status(500).json({
        error: 'Server Error',
        code: 'USER_FETCH_FAILED',
        message: err.message
      });
    }
  },

  // Создание пользователя (админ + модератор)
  async create(req, res) {
    try {
      // Проверка прав
      if (!['admin', 'moderator'].includes(req.user.role)) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Admin/moderator access required'
        });
      }

      const { email, password, role = 'user' } = req.body;

      // Валидация роли
      if (req.user.role === 'moderator' && role === 'admin') {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Moderators cannot create admin users'
        });
      }

      // Проверка существования пользователя
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          error: 'Bad Request',
          code: 'USER_EXISTS',
          message: 'Email already registered'
        });
      }

      // Хеширование пароля
      const hashedPassword = await bcrypt.hash(password, 12);

      // Создание пользователя
      const user = await User.create({
        email,
        password: hashedPassword,
        role
      });

      // Ответ без пароля
      res.status(201).json({
        id: user._id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      });
    } catch (err) {
      res.status(500).json({
        error: 'Server Error',
        code: 'USER_CREATION_FAILED',
        message: err.message
      });
    }
  },

  // Обновление пользователя
  async update(req, res) {
    try {
      const { id } = req.params;
      const { email, password, role } = req.body;

      // Проверка прав
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Admin access required'
        });
      }

      // Поиск пользователя
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          error: 'Not Found',
          code: 'USER_NOT_FOUND'
        });
      }

      // Обновление полей
      if (email) user.email = email;
      if (role) user.role = role;
      if (password) {
        user.password = await bcrypt.hash(password, 12);
      }

      await user.save();

      // Ответ без пароля
      res.json({
        id: user._id,
        email: user.email,
        role: user.role,
        updatedAt: user.updatedAt
      });
    } catch (err) {
      res.status(500).json({
        error: 'Server Error',
        code: 'USER_UPDATE_FAILED',
        message: err.message
      });
    }
  },

  // Удаление пользователя
  async delete(req, res) {
    try {
      const { id } = req.params;

      // Проверка прав
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Admin access required'
        });
      }

      // Нельзя удалить себя
      if (id === req.user.id) {
        return res.status(400).json({
          error: 'Bad Request',
          code: 'SELF_DELETE',
          message: 'Cannot delete your own account'
        });
      }

      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return res.status(404).json({
          error: 'Not Found',
          code: 'USER_NOT_FOUND'
        });
      }

      res.json({
        message: 'User deleted successfully',
        id: user._id
      });
    } catch (err) {
      res.status(500).json({
        error: 'Server Error',
        code: 'USER_DELETION_FAILED',
        message: err.message
      });
    }
  }
};