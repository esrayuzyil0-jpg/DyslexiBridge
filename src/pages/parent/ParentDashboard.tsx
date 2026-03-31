import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import type { Database } from '../../lib/database.types';

type Student = Database['public']['Tables']['students']['Row'];
type Assignment = Database['public']['Tables']['assignments']['Row'] & {
  students?: Student;
};

export default function ParentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      const { data: studentData } = await supabase
        .from('students')
        .select('*')
        .eq('parent_id', user.id)
        .maybeSingle();

      if (studentData) {
        setStudent(studentData);

        const { data: assignmentsData } = await supabase
          .from('assignments')
          .select('*')
          .eq('student_id', studentData.id)
          .order('created_at', { ascending: false });

        if (assignmentsData) setAssignments(assignmentsData);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!student) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Henüz Bir Öğrenci Atanmadı
            </h3>
            <p className="text-gray-600">
              Lütfen öğretmeninizle iletişime geçin ve hesabınıza bir öğrenci atamasını isteyin.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  const activeAssignments = assignments.filter(a => a.status !== 'completed');
  const completedAssignments = assignments.filter(a => a.status === 'completed');

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <h2 className="text-3xl font-bold mb-2">Merhaba!</h2>
          <p className="text-blue-100">
            {student.full_name} için hazırlanan ödevlere göz atın
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aktif Ödevler</h3>
            <p className="text-4xl font-bold text-blue-600">{activeAssignments.length}</p>
            <p className="text-sm text-gray-600 mt-2">Tamamlanmayı bekliyor</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tamamlanan</h3>
            <p className="text-4xl font-bold text-green-600">{completedAssignments.length}</p>
            <p className="text-sm text-gray-600 mt-2">Başarıyla tamamlandı</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">Bugünkü Ödevler</h3>
          </div>
          <div className="p-6">
            {activeAssignments.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Harika!</h4>
                <p className="text-gray-600">Şu anda bekleyen ödeviniz yok.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => navigate(`/parent/assignments/${assignment.id}`)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          Günlük Ödev
                        </h4>
                        {assignment.simplified_description ? (
                          <p className="text-gray-700 leading-relaxed">
                            {assignment.simplified_description}
                          </p>
                        ) : (
                          <p className="text-gray-500 italic">
                            Ödev hazırlanıyor...
                          </p>
                        )}
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium ml-4">
                        Yeni
                      </span>
                    </div>

                    {assignment.target_skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {assignment.target_skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      Ödevi Görüntüle ve Oyunları İncele
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {completedAssignments.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Tamamlanan Ödevler</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {completedAssignments.slice(0, 5).map((assignment) => (
                  <div
                    key={assignment.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-gray-700 line-clamp-1">
                        {assignment.simplified_description || assignment.academic_description}
                      </p>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium ml-4">
                        Tamamlandı
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
