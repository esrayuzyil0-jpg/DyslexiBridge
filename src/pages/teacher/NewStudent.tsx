import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import type { Database } from '../../lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function NewStudent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [parents, setParents] = useState<Profile[]>([]);
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    parentId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadParents();
  }, []);

  const loadParents = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'parent')
      .order('full_name');

    if (data) setParents(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError('');
    setLoading(true);

    try {
      const { error: insertError } = await supabase
        .from('students')
        .insert({
          full_name: formData.fullName,
          age: parseInt(formData.age),
          teacher_id: user.id,
          parent_id: formData.parentId,
        } as any);

      if (insertError) throw insertError;

      navigate('/dashboard');
    } catch (err) {
      setError('Öğrenci eklenirken bir hata oluştu.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Yeni Öğrenci Ekle</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Öğrenci Ad Soyad
              </label>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Öğrencinin adı ve soyadı"
              />
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                Yaş
              </label>
              <input
                id="age"
                type="number"
                min="1"
                max="17"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="6"
              />
            </div>

            <div>
              <label htmlFor="parentId" className="block text-sm font-medium text-gray-700 mb-2">
                Veli
              </label>
              <select
                id="parentId"
                value={formData.parentId}
                onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Veli seçin</option>
                {parents.map((parent) => (
                  <option key={parent.id} value={parent.id}>
                    {parent.full_name} ({parent.email})
                  </option>
                ))}
              </select>
              {parents.length === 0 && (
                <p className="text-sm text-amber-600 mt-2">
                  Henüz sistemde kayıtlı veli yok. Veliler önce kayıt olmalı.
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={loading || parents.length === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Ekleniyor...' : 'Öğrenci Ekle'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
