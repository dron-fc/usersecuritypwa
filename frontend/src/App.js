import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AdminPanel from './components/Admin/AdminPanel';
import AdminUsersPanel from './components/Admin/AdminUsersPanel'; // Добавлен этот импорт
import UserDashboard from './components/User/UserDashboard';
import ModeratorPanel from './components/Moderator/ModeratorPanel';
import NotFound from './components/Common/NotFound';
import Unauthorized from './components/Common/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Публичные маршруты */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Админские маршруты */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          
          {/* Отдельный маршрут для управления пользователями */}
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminUsersPanel />
              </ProtectedRoute>
            }
          />

          {/* Остальные маршруты */}
          <Route
            path="/moderator"
            element={
              <ProtectedRoute requiredRole="moderator">
                <ModeratorPanel />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/user"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Специальные маршруты */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/404" element={<NotFound />} />
          
          {/* Перенаправления */}
          <Route path="/" element={<Navigate to="/user" replace />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;