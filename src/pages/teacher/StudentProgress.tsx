import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Layout from '../../components/Layout';
import type { Database } from '../../lib/database.types';

type Student = Database['public']['Tables']['students']['Row'];
type Assignment = Database['public']['Tables']['assignments']['Row'];
type Feedback = Database['public']['Tables']['feedback']['Row'];

interface AssignmentWithFeedback extends Assignment {
  feedback: Feedback[];
}

export default function StudentProgress() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [assignments, setAssignments] = useState<AssignmentWithFeedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudentData();
  }, [id]);

  const loadStudentData = async () => {
    if (!id) return;

    try {
      const { data: studentData } = await supabase
        .from('students')
        .select('*')
        .eq('id', id)
        .single();

      if (studentData) {
        setStudent(studentData);

        const { data: assignmentsData } = await supabase
          .from('assignments')
          .select('*, feedback(*)')
          .eq('student_id', id)
          .order('created_at', { ascending: false });

        if (assignmentsData) {
          setAssignments(assignmentsData as AssignmentWithFeedback[]);
        }
      }
    } catch (error) {
      console.error('Error loading student data:', error);
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
        <div className="text-center py-12">
          <p className="text-gray-600">Öğrenci bulunamadı.</p>
        </div>
      </Layout>
    );
  }

  const completedAssignments = assignments.filter(a => a.status === 'completed');
  const averageDifficulty = completedAssignments.length > 0
    ? completedAssignments.reduce((sum, a) => {
        const avgFeedback = a.feedback.reduce((s, f) => s + f.difficulty_level, 0) / (a.feedback.length || 1);
        return sum + avgFeedback;
      }, 0) / completedAssignments.length
    : 0;

  const averageEnjoyment = completedAssignments.length > 0
    ? completedAssignments.reduce((sum, a) => {
        const avgFeedback = a.feedback.reduce((s, f) => s + f.enjoyment_level, 0) / (a.feedback.length || 1);
        return sum + avgFeedback;
      }, 0) / completedAssignments.length
    : 0;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Dashboard'a Dön
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{student.full_name}</h1>
              <p className="text-gray-600">Yaş: {student.age}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-600 mb-1">Toplam Ödev</h3>
              <p className="text-3xl font-bold text-blue-600">{assignments.length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-600 mb-1">Tamamlanan</h3>
              <p className="text-3xl font-bold text-green-600">{completedAssignments.length}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-600 mb-1">Ortalama Zorluk</h3>
              <p className="text-3xl font-bold text-yellow-600">
                {averageDifficulty > 0 ? averageDifficulty.toFixed(1) : '-'}/5
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-600 mb-1">Eğlenme Skoru</h3>
              <p className="text-3xl font-bold text-purple-600">
                {averageEnjoyment > 0 ? averageEnjoyment.toFixed(1) : '-'}/5
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Ödev Geçmişi</h2>

          {assignments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Henüz ödev atanmamış.
            </div>
          ) : (
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="border border-gray-200 rounded-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {new Date(assignment.created_at).toLocaleDateString('tr-TR')}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          assignment.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : assignment.status === 'in_progress'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {assignment.status === 'completed'
                            ? 'Tamamlandı'
                            : assignment.status === 'in_progress'
                            ? 'Devam Ediyor'
                            : 'Bekliyor'}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{assignment.academic_description}</p>
                      <div className="flex flex-wrap gap-2">
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
                  </div>

                  {assignment.feedback.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3">Veli Geri Bildirimleri</h4>
                      <div className="space-y-3">
                        {assignment.feedback.map((fb) => (
                          <div key={fb.id} className="bg-gray-50 rounded-lg p-4">
                            <div className="grid grid-cols-3 gap-4 mb-2">
                              <div>
                                <span className="text-sm text-gray-600">Tamamlandı:</span>
                                <span className={`ml-2 font-medium ${fb.completed ? 'text-green-600' : 'text-red-600'}`}>
                                  {fb.completed ? 'Evet' : 'Hayır'}
                                </span>
                              </div>
                              <div>
                                <span className="text-sm text-gray-600">Zorluk:</span>
                                <span className="ml-2 font-medium text-gray-900">{fb.difficulty_level}/5</span>
                              </div>
                              <div>
                                <span className="text-sm text-gray-600">Eğlenme:</span>
                                <span className="ml-2 font-medium text-gray-900">{fb.enjoyment_level}/5</span>
                              </div>
                            </div>
                            {fb.notes && (
                              <div className="mt-2">
                                <span className="text-sm text-gray-600">Notlar:</span>
                                <p className="text-gray-700 mt-1">{fb.notes}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
