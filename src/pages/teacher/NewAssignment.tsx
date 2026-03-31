import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import type { Database } from '../../lib/database.types';

type Student = Database['public']['Tables']['students']['Row'];

const commonSkills = [
  'Fonolojik Farkındalık',
  'Görsel Algı',
  'İşitsel Bellek',
  'Harf Tanıma',
  'Ses-Harf İlişkisi',
  'Okuma Akıcılığı',
  'Okuduğunu Anlama',
];

export default function NewAssignment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [formData, setFormData] = useState({
    studentId: '',
    academicDescription: '',
    targetSkills: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStudents();
  }, [user]);

  const loadStudents = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('students')
      .select('*')
      .eq('teacher_id', user.id)
      .order('full_name');

    if (data) setStudents(data);
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      targetSkills: prev.targetSkills.includes(skill)
        ? prev.targetSkills.filter(s => s !== skill)
        : [...prev.targetSkills, skill]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError('');
    setLoading(true);
    setGenerating(true);

    try {
      const { data: assignment, error: insertError } = await supabase
        .from('assignments')
        .insert({
          student_id: formData.studentId,
          teacher_id: user.id,
          academic_description: formData.academicDescription,
          target_skills: formData.targetSkills,
          status: 'pending',
        } as any)
        .select()
        .single();

      if (insertError) throw insertError;

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-assignment-content`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignmentId: assignment.id,
          academicDescription: formData.academicDescription,
          targetSkills: formData.targetSkills,
        }),
      });

      if (!response.ok) {
        throw new Error('AI içerik oluşturulamadı');
      }

      const aiContent = await response.json();

      await supabase
        .from('assignments')
        .update({
          simplified_description: aiContent.simplifiedDescription,
          status: 'in_progress',
        } as any)
        .eq('id', assignment!.id);

      if (aiContent.games && aiContent.games.length > 0) {
        const gamesData = aiContent.games.map((game: any) => ({
          assignment_id: assignment!.id,
          title: game.title,
          description: game.description,
          materials: game.materials,
          duration_minutes: game.duration_minutes,
          difficulty: game.difficulty,
        }));

        await supabase.from('games').insert(gamesData as any);
      }

      setGenerating(false);
      navigate('/dashboard');
    } catch (err) {
      setError('Ödev oluşturulurken bir hata oluştu.');
      console.error(err);
      setGenerating(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Geri Dön
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Yeni Ödev Oluştur</h2>
          <p className="text-gray-600 mb-6">
            Akademik açıklamanızı girin, yapay zeka bunu velinin anlayabileceği hale getirecek ve oyunlar önerecek.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
                Öğrenci Seçin
              </label>
              <select
                id="studentId"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Öğrenci seçin</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.full_name} ({student.age} yaş)
                  </option>
                ))}
              </select>
              {students.length === 0 && (
                <p className="text-sm text-amber-600 mt-2">
                  Henüz öğrenciniz yok. Önce öğrenci eklemelisiniz.
                </p>
              )}
            </div>

            <div>
              <label htmlFor="academicDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Akademik Açıklama
              </label>
              <textarea
                id="academicDescription"
                value={formData.academicDescription}
                onChange={(e) => setFormData({ ...formData, academicDescription: e.target.value })}
                required
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Örnek: Fonolojik farkındalık çalışması için 'b' ve 'd' ses ayrımı egzersizleri yapılmalı. Öğrenci bu sesleri karıştırıyor ve görsel-işitsel eşleştirme yapması gerekiyor."
              />
              <p className="text-sm text-gray-500 mt-2">
                Teknik terimler kullanabilirsiniz. Yapay zeka bunu velinin anlayabileceği şekilde sadeleştirecek.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Hedef Beceriler
              </label>
              <div className="flex flex-wrap gap-2">
                {commonSkills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      formData.targetSkills.includes(skill)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {generating && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <p className="text-blue-700">
                    Yapay zeka ödevi veliler için sadeleştiriyor ve oyun önerileri oluşturuyor...
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={loading || students.length === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Oluşturuluyor...' : 'Ödev Oluştur'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
