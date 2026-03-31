import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import TeacherDashboard from './teacher/TeacherDashboard';
import ParentDashboard from './parent/ParentDashboard';

export default function Dashboard() {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  if (profile.role === 'teacher') {
    return <TeacherDashboard />;
  }

  if (profile.role === 'parent') {
    return <ParentDashboard />;
  }

  return <div>Yetkisiz erişim</div>;
}
