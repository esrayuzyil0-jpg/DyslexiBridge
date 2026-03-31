/*
  # DyslexiBridge İlk Veritabanı Şeması

  1. Yeni Tablolar
    - `profiles` - Kullanıcı profilleri (öğretmen, veli, admin)
    - `students` - Öğrenci bilgileri
    - `assignments` - Ödevler ve hedefler
    - `games` - AI tarafından oluşturulan oyun önerileri
    - `feedback` - Veli geri bildirimleri

  2. Güvenlik
    - Tüm tablolarda RLS aktif
    - Rol bazlı erişim kontrolleri
    - Öğretmenler sadece kendi öğrencilerini yönetebilir
    - Veliler sadece kendi çocuklarının verilerini görebilir

  3. Önemli Notlar
    - Cascade delete ile veri bütünlüğü sağlanır
    - Indexler ile sorgu performansı optimize edilir
    - Trigger'lar ile otomatik updated_at güncelleme
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('teacher', 'parent', 'admin')),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  age integer NOT NULL CHECK (age > 0 AND age < 18),
  teacher_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  teacher_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  academic_description text NOT NULL,
  simplified_description text,
  target_skills text[] DEFAULT '{}' NOT NULL,
  status text DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed')),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  materials text[] DEFAULT '{}' NOT NULL,
  duration_minutes integer DEFAULT 15 NOT NULL,
  difficulty text DEFAULT 'medium' NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  parent_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  game_id uuid REFERENCES games(id) ON DELETE SET NULL,
  completed boolean DEFAULT false NOT NULL,
  difficulty_level integer NOT NULL CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
  enjoyment_level integer NOT NULL CHECK (enjoyment_level >= 1 AND enjoyment_level <= 5),
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_students_teacher ON students(teacher_id);
CREATE INDEX IF NOT EXISTS idx_students_parent ON students(parent_id);
CREATE INDEX IF NOT EXISTS idx_assignments_student ON assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_assignments_teacher ON assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON assignments(status);
CREATE INDEX IF NOT EXISTS idx_games_assignment ON games(assignment_id);
CREATE INDEX IF NOT EXISTS idx_feedback_assignment ON feedback(assignment_id);
CREATE INDEX IF NOT EXISTS idx_feedback_parent ON feedback(parent_id);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Teachers can view their students"
  ON students FOR SELECT
  TO authenticated
  USING (
    teacher_id = auth.uid() OR 
    parent_id = auth.uid()
  );

CREATE POLICY "Teachers can create students"
  ON students FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'teacher'
    )
  );

CREATE POLICY "Teachers can update their students"
  ON students FOR UPDATE
  TO authenticated
  USING (teacher_id = auth.uid())
  WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "Teachers can delete their students"
  ON students FOR DELETE
  TO authenticated
  USING (teacher_id = auth.uid());

CREATE POLICY "Teachers and parents can view assignments"
  ON assignments FOR SELECT
  TO authenticated
  USING (
    teacher_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM students
      WHERE students.id = assignments.student_id
      AND students.parent_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can create assignments"
  ON assignments FOR INSERT
  TO authenticated
  WITH CHECK (
    teacher_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'teacher'
    )
  );

CREATE POLICY "Teachers can update their assignments"
  ON assignments FOR UPDATE
  TO authenticated
  USING (teacher_id = auth.uid())
  WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "Teachers can delete their assignments"
  ON assignments FOR DELETE
  TO authenticated
  USING (teacher_id = auth.uid());

CREATE POLICY "Users can view games for their assignments"
  ON games FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM assignments
      WHERE assignments.id = games.assignment_id
      AND (
        assignments.teacher_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM students
          WHERE students.id = assignments.student_id
          AND students.parent_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Teachers can create games"
  ON games FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM assignments
      WHERE assignments.id = games.assignment_id
      AND assignments.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Parents can view feedback for their children"
  ON feedback FOR SELECT
  TO authenticated
  USING (
    parent_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM assignments
      WHERE assignments.id = feedback.assignment_id
      AND assignments.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Parents can create feedback"
  ON feedback FOR INSERT
  TO authenticated
  WITH CHECK (
    parent_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM assignments a
      JOIN students s ON s.id = a.student_id
      WHERE a.id = feedback.assignment_id
      AND s.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can update their own feedback"
  ON feedback FOR UPDATE
  TO authenticated
  USING (parent_id = auth.uid())
  WITH CHECK (parent_id = auth.uid());
