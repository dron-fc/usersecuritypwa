import jwt from 'jsonwebtoken';

export const authenticate = (requiredRole) => {
  return async (req, res, next) => {
    try {
      // 1. Проверка наличия токена
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
          error: 'Authentication required',
          code: 'MISSING_TOKEN'
        });
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        return res.status(401).json({ 
          error: 'Malformed token',
          code: 'INVALID_TOKEN_FORMAT'
        });
      }

      // 2. Верификация токена
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // 3. Проверка роли (если требуется)
      if (requiredRole && decoded.role !== requiredRole) {
        return res.status(403).json({ 
          error: `Access forbidden. Required role: ${requiredRole}`,
          code: 'INSUFFICIENT_PERMISSIONS',
          requiredRole,
          userRole: decoded.role
        });
      }

      // 4. Присоединение данных пользователя к запросу
      req.user = {
        id: decoded.id,
        role: decoded.role,
        email: decoded.email // если есть в токене
      };

      next();
    } catch (err) {
      // 5. Детальная обработка ошибок
      let status = 401;
      let error = 'Invalid token';
      let code = 'TOKEN_VERIFICATION_FAILED';

      if (err.name === 'TokenExpiredError') {
        status = 401;
        error = 'Token expired';
        code = 'TOKEN_EXPIRED';
      } else if (err.name === 'JsonWebTokenError') {
        status = 401;
        error = 'Invalid token signature';
        code = 'INVALID_TOKEN_SIGNATURE';
      }

      return res.status(status).json({ error, code });
    }
  };
};

// Дополнительные middleware для конкретных ролей
export const requireAdmin = authenticate('admin');
export const requireModerator = authenticate('moderator');