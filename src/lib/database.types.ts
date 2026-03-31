export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'teacher' | 'parent' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role: 'teacher' | 'parent' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: 'teacher' | 'parent' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      students: {
        Row: {
          id: string
          full_name: string
          age: number
          teacher_id: string
          parent_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          age: number
          teacher_id: string
          parent_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          age?: number
          teacher_id?: string
          parent_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      assignments: {
        Row: {
          id: string
          student_id: string
          teacher_id: string
          academic_description: string
          simplified_description: string | null
          target_skills: string[]
          status: 'pending' | 'in_progress' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          teacher_id: string
          academic_description: string
          simplified_description?: string | null
          target_skills: string[]
          status?: 'pending' | 'in_progress' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          teacher_id?: string
          academic_description?: string
          simplified_description?: string | null
          target_skills?: string[]
          status?: 'pending' | 'in_progress' | 'completed'
          created_at?: string
          updated_at?: string
        }
      }
      games: {
        Row: {
          id: string
          assignment_id: string
          title: string
          description: string
          materials: string[]
          duration_minutes: number
          difficulty: 'easy' | 'medium' | 'hard'
          created_at: string
        }
        Insert: {
          id?: string
          assignment_id: string
          title: string
          description: string
          materials: string[]
          duration_minutes: number
          difficulty?: 'easy' | 'medium' | 'hard'
          created_at?: string
        }
        Update: {
          id?: string
          assignment_id?: string
          title?: string
          description?: string
          materials?: string[]
          duration_minutes?: number
          difficulty?: 'easy' | 'medium' | 'hard'
          created_at?: string
        }
      }
      feedback: {
        Row: {
          id: string
          assignment_id: string
          parent_id: string
          game_id: string | null
          completed: boolean
          difficulty_level: number
          enjoyment_level: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          assignment_id: string
          parent_id: string
          game_id?: string | null
          completed?: boolean
          difficulty_level: number
          enjoyment_level: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          assignment_id?: string
          parent_id?: string
          game_id?: string | null
          completed?: boolean
          difficulty_level?: number
          enjoyment_level?: number
          notes?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
