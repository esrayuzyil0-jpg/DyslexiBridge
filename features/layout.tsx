import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-blue-600">DyslexiBridge</h1>
              {profile && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {profile.role === 'teacher' ? 'Öğretmen' : 'Veli'}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {profile && (
                <>
                  <span className="text-gray-700 font-medium">{profile.full_name}</span>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Çıkış Yap
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="container-custom py-8">
        {children}
      </main>
    </div>
  );
}
