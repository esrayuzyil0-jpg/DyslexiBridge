import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewStudent from './pages/teacher/NewStudent';
import NewAssignment from './pages/teacher/NewAssignment';
import StudentProgress from './pages/teacher/StudentProgress';
import AssignmentDetail from './pages/parent/AssignmentDetail';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/students/new"
            element={
              <ProtectedRoute requiredRole="teacher">
                <NewStudent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/assignments/new"
            element={
              <ProtectedRoute requiredRole="teacher">
                <NewAssignment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/students/:id"
            element={
              <ProtectedRoute requiredRole="teacher">
                <StudentProgress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/assignments/:id"
            element={
              <ProtectedRoute requiredRole="parent">
                <AssignmentDetail />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
