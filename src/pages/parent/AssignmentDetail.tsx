import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import type { Database } from '../../lib/database.types';

type Assignment = Database['public']['Tables']['assignments']['Row'];
type Game = Database['public']['Tables']['games']['Row'];

export default function AssignmentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedback, setFeedback] = useState({
    completed: false,
    difficultyLevel: 3,
    enjoymentLevel: 3,
    notes: '',
  });

  useEffect(() => {
    loadAssignmentData();
  }, [id, user]);

  const loadAssignmentData = async () => {
    if (!id || !user) return;

    try {
      const { data: assignmentData } = await supabase
        .from('assignments')
        .select('*')
        .eq('id', id)
        .single();

      if (assignmentData) {
        setAssignment(assignmentData);

        const { data: gamesData } = await supabase
          .from('games')
          .select('*')
          .eq('assignment_id', id);

        if (gamesData) setGames(gamesData);
      }
    } catch (error) {
      console.error('Error loading assignment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !user) return;

    try {
      await supabase.from('feedback').insert({
        assignment_id: id,
        parent_id: user.id,
        game_id: null,
        completed: feedback.completed,
        difficulty_level: feedback.difficultyLevel,
        enjoyment_level: feedback.enjoymentLevel,
        notes: feedback.notes,
      } as any);

      if (feedback.completed) {
        await supabase
          .from('assignments')
          .update({ status: 'completed' } as any)
          .eq('id', id);
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting feedback:', error);
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

  if (!assignment) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-600">Ödev bulunamadı.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
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

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-8 text-white mb-6">
          <h1 className="text-3xl font-bold mb-2">Günün Ödevi</h1>
          <p className="text-blue-100">Çocuğunuzla eğlenceli vakit geçirmenin zamanı</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Bugün Ne Yapacağız?</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {assignment.simplified_description || assignment.academic_description}
            </p>
          </div>

          {assignment.target_skills.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Geliştirilecek Beceriler</h3>
              <div className="flex flex-wrap gap-2">
                {assignment.target_skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Oyun Önerileri</h2>
          <p className="text-gray-600 mb-6">
            Evdeki basit malzemelerle yapabileceğiniz eğlenceli oyunlar
          </p>

          {games.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600">Oyunlar hazırlanıyor... Lütfen daha sonra tekrar kontrol edin.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {games.map((game, index) => (
                <div
                  key={game.id}
                  className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {index + 1}. {game.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      game.difficulty === 'easy'
                        ? 'bg-green-100 text-green-700'
                        : game.difficulty === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {game.difficulty === 'easy' ? 'Kolay' : game.difficulty === 'medium' ? 'Orta' : 'Zor'}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-4 leading-relaxed">{game.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Gerekli Malzemeler</h4>
                      <ul className="space-y-1">
                        {game.materials.map((material, idx) => (
                          <li key={idx} className="text-gray-700 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                            {material}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Tahmini Süre</h4>
                      <p className="text-gray-700">{game.duration_minutes} dakika</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!showFeedbackForm ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ödevi Tamamladınız mı?</h2>
            <p className="text-gray-600 mb-6">
              Öğretmeninize geri bildirim göndererek çocuğunuzun gelişimini takip etmesine yardımcı olun.
            </p>
            <button
              onClick={() => setShowFeedbackForm(true)}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Geri Bildirim Ver
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Geri Bildirim</h2>
            <form onSubmit={handleSubmitFeedback} className="space-y-6">
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={feedback.completed}
                    onChange={(e) => setFeedback({ ...feedback, completed: e.target.checked })}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-900 font-medium">Ödevi tamamladık</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Zorluk Seviyesi: {feedback.difficultyLevel}/5
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={feedback.difficultyLevel}
                  onChange={(e) => setFeedback({ ...feedback, difficultyLevel: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Çok Kolay</span>
                  <span>Çok Zor</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Eğlenme Seviyesi: {feedback.enjoymentLevel}/5
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={feedback.enjoymentLevel}
                  onChange={(e) => setFeedback({ ...feedback, enjoymentLevel: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Hiç Eğlenmedi</span>
                  <span>Çok Eğlendi</span>
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Notlarınız (Opsiyonel)
                </label>
                <textarea
                  id="notes"
                  value={feedback.notes}
                  onChange={(e) => setFeedback({ ...feedback, notes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Öğretmeninizle paylaşmak istediğiniz notlar..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowFeedbackForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Gönder
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
}
