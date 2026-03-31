import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import type { Database } from '../../lib/database.types';

type Student = Database['public']['Tables']['students']['Row'];
type Assignment = Database['public']['Tables']['assignments']['Row'];

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [recentAssignments, setRecentAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      const [studentsRes, assignmentsRes] = await Promise.all([
        supabase
          .from('students')
          .select('*')
          .eq('teacher_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('assignments')
          .select('*')
          .eq('teacher_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      if (studentsRes.data) setStudents(studentsRes.data);
      if (assignmentsRes.data) setRecentAssignments(assignmentsRes.data);
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

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">Öğretmen Paneli</h2>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/teacher/students/new')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Yeni Öğrenci Ekle
            </button>
            <button
              onClick={() => navigate('/teacher/assignments/new')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Yeni Ödev Oluştur
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Toplam Öğrenci</h3>
            <p className="text-4xl font-bold text-blue-600">{students.length}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aktif Ödevler</h3>
            <p className="text-4xl font-bold text-green-600">
              {recentAssignments.filter(a => a.status !== 'completed').length}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tamamlanan</h3>
            <p className="text-4xl font-bold text-gray-600">
              {recentAssignments.filter(a => a.status === 'completed').length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">Öğrencilerim</h3>
          </div>
          <div className="p-6">
            {students.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Henüz öğrenci eklemediniz. Öğrenci ekleyerek başlayın.
              </div>
            ) : (
              <div className="space-y-3">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                    onClick={() => navigate(`/teacher/students/${student.id}`)}
                  >
                    <div>
                      <h4 className="font-semibold text-gray-900">{student.full_name}</h4>
                      <p className="text-sm text-gray-600">Yaş: {student.age}</p>
                    </div>
                    <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      Detaylar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">Son Ödevler</h3>
          </div>
          <div className="p-6">
            {recentAssignments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Henüz ödev oluşturmadınız.
              </div>
            ) : (
              <div className="space-y-3">
                {recentAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {assignment.academic_description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {assignment.target_skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          assignment.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : assignment.status === 'in_progress'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {assignment.status === 'completed'
                          ? 'Tamamlandı'
                          : assignment.status === 'in_progress'
                          ? 'Devam Ediyor'
                          : 'Bekliyor'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
